import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const BUCKET_NAME = "corporate";
const CAROUSEL_METADATA_PATH = "_metadata/carousel.json";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

interface CarouselSlide {
    id: string;
    image: string;
    tag_en: string;
    tag_ar: string;
    title_en: string;
    title_ar: string;
    description_en: string;
    description_ar: string;
    order: number;
}

async function isAuthorized() {
    const cookieStore = await cookies();
    return cookieStore.get("admin_session")?.value === "true";
}

async function getCarouselData(): Promise<CarouselSlide[]> {
    try {
        const { data, error } = await supabase.storage.from(BUCKET_NAME).download(CAROUSEL_METADATA_PATH);
        if (!error && data) {
            const text = await data.text();
            return JSON.parse(text);
        }
    } catch (e) {
        // Silently fail and return empty parity with products API
    }
    return [];
}

async function saveCarouselData(data: CarouselSlide[]) {
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const { error } = await supabase.storage.from(BUCKET_NAME).upload(CAROUSEL_METADATA_PATH, blob, {
        upsert: true,
    });
    return !error;
}

export async function GET() {
    if (!SUPABASE_URL) {
        return NextResponse.json({ error: "Configuration error", slides: [] }, { status: 500 });
    }

    const slides = await getCarouselData();
    return NextResponse.json({ slides });
}

export async function POST(req: Request) {
    if (!(await isAuthorized())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const formData = await req.formData();
        const action = formData.get("action");

        if (action === "update-order") {
            const updatedSlides = JSON.parse(formData.get("slides") as string);
            const success = await saveCarouselData(updatedSlides);
            return NextResponse.json({ success });
        }

        const file = formData.get("file") as File;
        const slideDataJson = formData.get("slideData") as string;

        if (!slideDataJson) {
            return NextResponse.json({ error: "Missing slide data" }, { status: 400 });
        }

        const newSlide: CarouselSlide = JSON.parse(slideDataJson);
        const slides = await getCarouselData();

        if (file) {
            console.log(`Uploading file to carousel/${Date.now()}-${file.name}`);
            const fileName = `${Date.now()}-${file.name}`;
            const { data, error } = await supabase.storage
                .from(BUCKET_NAME)
                .upload(`carousel/${fileName}`, file);

            if (error) {
                console.error("Supabase Storage Error:", error);
                return NextResponse.json({
                    error: error.message,
                    details: error,
                    code: (error as any).status || (error as any).statusCode
                }, { status: 500 });
            }
            newSlide.image = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/carousel/${fileName}`;
            console.log("File uploaded successfully:", newSlide.image);
        }

        const existingIndex = slides.findIndex(s => s.id === newSlide.id);
        if (existingIndex > -1) {
            slides[existingIndex] = { ...slides[existingIndex], ...newSlide };
        } else {
            newSlide.id = Date.now().toString();
            newSlide.order = slides.length;
            slides.push(newSlide);
        }

        const success = await saveCarouselData(slides);
        if (!success) {
            console.error("Failed to save metadata to _metadata/carousel.json");
            return NextResponse.json({ error: "Failed to save carousel metadata" }, { status: 500 });
        }

        revalidatePath("/");
        return NextResponse.json({ success, slide: newSlide });
    } catch (error) {
        console.error("Carousel POST error:", error);
        return NextResponse.json({
            error: "Internal server error",
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    if (!(await isAuthorized())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Missing slide ID" }, { status: 400 });
        }

        const slides = await getCarouselData();
        const slideToDelete = slides.find(s => s.id === id);

        if (!slideToDelete) {
            return NextResponse.json({ error: "Slide not found" }, { status: 404 });
        }

        // Try to remove image if it's in our storage
        if (slideToDelete.image.includes("/carousel/")) {
            const url = new URL(slideToDelete.image);
            const pathParts = url.pathname.split("/public/corporate/")[1];
            if (pathParts) {
                const { error: deleteError } = await supabase.storage.from(BUCKET_NAME).remove([pathParts]);
                if (deleteError) {
                    console.warn("Could not delete image from storage:", deleteError);
                }
            }
        }

        const filtered = slides.filter(s => s.id !== id);
        const success = await saveCarouselData(filtered);
        if (success) revalidatePath("/");
        return NextResponse.json({ success });
    } catch (error) {
        console.error("Carousel DELETE error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
