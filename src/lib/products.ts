import { supabase } from "./supabase";

const BUCKET_NAME = "corporate";
const METADATA_PATH = "_metadata/categories.json";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

const INITIAL_CATEGORIES = [
    { id: "army", label: "Army & Tactical" },
    { id: "police", label: "Police & Security" },
    { id: "bar-mat", label: "Bar Mats" },
    { id: "coasters", label: "Coasters" },
    { id: "flash-memory", label: "Flash Memory" },
    { id: "fridge-magnet", label: "Fridge Magnets" },
    { id: "label", label: "Labels & Tags" },
    { id: "lighter", label: "Lighter Covers" },
    { id: "mobile-holder", label: "Mobile Holders" },
    { id: "pen-accessories", label: "Pen Accessories" },
    { id: "keychains", label: "Keychains" },
];

// Simple in-memory cache for server-side use
let cachedProducts: { products: any[], categories: any[], timestamp: number } | null = null;
const CACHE_TTL = 1000 * 60 * 10; // 10 minutes

export async function getServerSideProducts() {
    if (!SUPABASE_URL) return { products: [], categories: INITIAL_CATEGORIES };

    const now = Date.now();
    if (cachedProducts && (now - cachedProducts.timestamp < CACHE_TTL)) {
        return {
            products: cachedProducts.products,
            categories: cachedProducts.categories,
            cached: true
        };
    }

    try {
        let categories = INITIAL_CATEGORIES;
        try {
            const { data, error } = await supabase.storage.from(BUCKET_NAME).download(METADATA_PATH);
            if (!error && data) {
                const text = await data.text();
                categories = JSON.parse(text);
            }
        } catch (e) { }

        const allProducts: any[] = [];
        const categoryPromises = categories.map(async (cat: any) => {
            try {
                const { data: categoryFiles } = await supabase.storage
                    .from(BUCKET_NAME)
                    .list(cat.id, {
                        limit: 100,
                        sortBy: { column: 'name', order: 'asc' }
                    });

                if (!categoryFiles || categoryFiles.length === 0) return [];

                return categoryFiles
                    .filter((file) => file.name !== ".emptyFolderPlaceholder" && !file.name.includes(".json"))
                    .map((file, index) => ({
                        id: `${cat.id}-${index}-${file.id || file.name}`,
                        name: `${cat.label} #${index + 1}`,
                        category: cat.id,
                        categoryLabel: cat.label,
                        image: `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${cat.id}/${file.name}`,
                    }));
            } catch (err) {
                return [];
            }
        });

        const results = await Promise.all(categoryPromises);
        results.forEach((categoryProducts) => {
            allProducts.push(...categoryProducts);
        });

        cachedProducts = {
            products: allProducts,
            categories,
            timestamp: now
        };

        return { products: allProducts, categories };
    } catch (error) {
        return { products: [], categories: INITIAL_CATEGORIES };
    }
}
const CAROUSEL_METADATA_PATH = "_metadata/carousel.json";

export async function getServerSideCarousel() {
    if (!SUPABASE_URL) return [];

    try {
        const { data, error } = await supabase.storage.from(BUCKET_NAME).download(CAROUSEL_METADATA_PATH);
        if (!error && data) {
            const text = await data.text();
            const slides = JSON.parse(text);
            return slides.sort((a: any, b: any) => a.order - b.order);
        }
    } catch (e) {
        console.error("Error fetching server-side carousel:", e);
    }
    return [];
}
