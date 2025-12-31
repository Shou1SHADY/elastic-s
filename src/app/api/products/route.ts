import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";

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

interface Product {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  image: string;
}

// Simple in-memory cache
let cachedData: { products: Product[], categories: any[], timestamp: number } | null = null;
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

async function isAuthorized() {
  const cookieStore = await cookies();
  return cookieStore.get("admin_session")?.value === "true";
}

async function getCategories() {
  try {
    const { data, error } = await supabase.storage.from(BUCKET_NAME).download(METADATA_PATH);
    if (!error && data) {
      const text = await data.text();
      return JSON.parse(text);
    }
  } catch (e) {
    // Silently fail and use defaults
  }
  return INITIAL_CATEGORIES;
}

async function saveCategories(categories: { id: string; label: string }[]) {
  const blob = new Blob([JSON.stringify(categories)], { type: "application/json" });
  const { error } = await supabase.storage.from(BUCKET_NAME).upload(METADATA_PATH, blob, {
    upsert: true,
  });
  if (!error) cachedData = null; // Invalidate cache
  return !error;
}

export async function GET() {
  if (!SUPABASE_URL) {
    return NextResponse.json({ error: "Configuration error", products: [], categories: [] }, { status: 500 });
  }

  const now = Date.now();
  if (cachedData && now - cachedData.timestamp < CACHE_TTL) {
    return NextResponse.json({
      products: cachedData.products,
      categories: cachedData.categories,
      cached: true
    });
  }

  try {
    const categories = await getCategories();
    const allProducts: Product[] = [];

    const categoryPromises = categories.map(async (cat: { id: string; label: string }) => {
      try {
        const { data: categoryFiles, error: listError } = await supabase.storage
          .from(BUCKET_NAME)
          .list(cat.id, {
            limit: 100,
            sortBy: { column: 'name', order: 'asc' }
          });

        if (listError || !categoryFiles || categoryFiles.length === 0) {
          return [];
        }

        return categoryFiles
          .filter((file) => file.name !== ".emptyFolderPlaceholder" && !file.name.includes(".json"))
          .map((file, index): Product => {
            const imageUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${cat.id}/${file.name}`;
            return {
              id: `${cat.id}-${index}-${file.id || file.name}`,
              name: `${cat.label} #${index + 1}`,
              category: cat.id,
              categoryLabel: cat.label,
              image: imageUrl,
            };
          });
      } catch (err) {
        return [];
      }
    });

    const results = await Promise.all(categoryPromises);
    results.forEach((categoryProducts) => {
      allProducts.push(...categoryProducts);
    });

    cachedData = {
      products: allProducts,
      categories: categories,
      timestamp: now
    };

    return NextResponse.json({
      products: allProducts,
      categories: categories,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error", products: [], categories: [] },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const action = formData.get("action");

    if (action === "add-category") {
      const id = formData.get("id") as string;
      const label = formData.get("label") as string;
      if (!id || !label) return NextResponse.json({ error: "Missing id or label" }, { status: 400 });

      const categories = await getCategories();
      if (categories.find((c: any) => c.id === id)) {
        return NextResponse.json({ error: "Category ID already exists" }, { status: 400 });
      }

      categories.push({ id, label });
      const success = await saveCategories(categories);
      return NextResponse.json({ success });
    }

    const file = formData.get("file") as File;
    const category = formData.get("category") as string;

    if (!file || !category) {
      return NextResponse.json({ error: "Missing file or category" }, { status: 400 });
    }

    const categories = await getCategories();
    if (!categories.find((c: any) => c.id === category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(`${category}/${Date.now()}-${file.name}`, file);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const path = searchParams.get("path");
    const categoryId = searchParams.get("categoryId");

    if (categoryId) {
      const categories = await getCategories();
      const filtered = categories.filter((c: any) => c.id !== categoryId);
      if (filtered.length === categories.length) {
        return NextResponse.json({ error: "Category not found" }, { status: 404 });
      }
      const success = await saveCategories(filtered);
      return NextResponse.json({ success });
    }

    if (!path) {
      return NextResponse.json({ error: "Missing file path" }, { status: 400 });
    }

    const { error } = await supabase.storage.from(BUCKET_NAME).remove([path]);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
