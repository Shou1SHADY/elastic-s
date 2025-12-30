import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const BUCKET_NAME = "corporate";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

const CATEGORIES = [
  "army",
  "police",
  "bar-mat",
  "coasters",
  "flash-memory",
  "fridge-magnet",
  "label",
  "lighter",
  "mobile-holder",
  "pen-accessories",
] as const;

type Category = (typeof CATEGORIES)[number];

const CATEGORY_LABELS: Record<Category, string> = {
  army: "Army & Tactical",
  police: "Police & Security",
  "bar-mat": "Bar Mats",
  coasters: "Coasters",
  "flash-memory": "Flash Memory",
  "fridge-magnet": "Fridge Magnets",
  label: "Labels & Tags",
  lighter: "Lighter Covers",
  "mobile-holder": "Mobile Holders",
  "pen-accessories": "Pen Accessories",
};

interface Product {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  image: string;
}

const FALLBACK_FILENAMES = ["1.jpeg", "2.jpeg", "3.jpeg", "4.jpeg", "5.jpeg", "6.jpeg", "7.jpeg", "8.jpeg"];

const UNSPLASH_FALLBACKS: Record<Category, string[]> = {
  army: [
    "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?q=80&w=800",
    "https://images.unsplash.com/photo-1616606103915-dea7be788566?q=80&w=800",
  ],
  police: [
    "https://images.unsplash.com/photo-1590523278191-995cbcda646b?q=80&w=800",
    "https://images.unsplash.com/photo-1589114471223-dec0d8d572c6?q=80&w=800",
  ],
  "bar-mat": ["https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800"],
  coasters: ["https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=800"],
  "flash-memory": ["https://images.unsplash.com/photo-1591405351990-4726e331f141?q=80&w=800"],
  "fridge-magnet": ["https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?q=80&w=800"],
  label: ["https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800"],
  lighter: ["https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800"],
  "mobile-holder": ["https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800"],
  "pen-accessories": ["https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800"],
};

async function checkFileExists(url: string) {
  if (!url || url.includes("undefined")) return false;
  try {
    // Try HEAD first for performance
    const res = await fetch(url, { method: "HEAD", cache: "no-store" });
    if (res.ok) return true;

    // Some storages might fail HEAD but allow GET
    if (res.status === 400 || res.status === 405) {
      const getRes = await fetch(url, { method: "GET", cache: "no-store", signal: AbortSignal.timeout(2000) });
      return getRes.ok;
    }

    return false;
  } catch (error) {
    console.error(`Error checking file existence for ${url}:`, error);
    return false;
  }
}

export async function GET() {
  if (!SUPABASE_URL) {
    console.error("NEXT_PUBLIC_SUPABASE_URL is not defined");
    return NextResponse.json({ error: "Configuration error", products: [], categories: [] }, { status: 500 });
  }

  try {
    const allProducts: Product[] = [];

    // Fetch files for each category explicitly
    const categoryPromises = CATEGORIES.map(async (category) => {
      try {
        const { data: categoryFiles, error: listError } = await supabase.storage
          .from(BUCKET_NAME)
          .list(category, {
            limit: 20,
            sortBy: { column: 'name', order: 'asc' }
          });

        if (listError || !categoryFiles || categoryFiles.length === 0) {
          console.log(`No files found for category ${category}, using fallbacks`);
          return UNSPLASH_FALLBACKS[category].map((url, index) => ({
            id: `${category}-unsplash-${index}`,
            name: `${CATEGORY_LABELS[category]} #${index + 1}`,
            category,
            categoryLabel: CATEGORY_LABELS[category],
            image: url,
          }));
        }

        const productPromises = categoryFiles
          .filter((file) => file.name !== ".emptyFolderPlaceholder")
          .map(async (file, index): Promise<Product | null> => {
            const imageUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${category}/${file.name}`;
            // Verify if the image actually exists to avoid 400/404 errors
            const exists = await checkFileExists(imageUrl);

            if (!exists) {
              console.log(`Image not found or inaccessible: ${imageUrl}`);
              return null;
            }

            return {
              id: `${category}-${index}-${file.id || file.name}`,
              name: `${CATEGORY_LABELS[category]} #${index + 1}`,
              category: category as string,
              categoryLabel: CATEGORY_LABELS[category],
              image: imageUrl,
            };
          });

        const categoryProducts = (await Promise.all(productPromises)).filter((p): p is Product => p !== null);

        // If no valid products found after checking files, use fallbacks
        if (categoryProducts.length === 0) {
          return UNSPLASH_FALLBACKS[category].map((url, index) => ({
            id: `${category}-unsplash-${index}`,
            name: `${CATEGORY_LABELS[category]} #${index + 1}`,
            category: category as string,
            categoryLabel: CATEGORY_LABELS[category],
            image: url,
          }));
        }

        return categoryProducts;
      } catch (err) {
        console.error(`Failed to process category ${category}:`, err);
        return [];
      }
    });

    const results = await Promise.all(categoryPromises);
    results.forEach((categoryProducts) => {
      allProducts.push(...categoryProducts);
    });

    return NextResponse.json({
      products: allProducts,
      categories: CATEGORIES.map((id) => ({ id, label: CATEGORY_LABELS[id] })),
    });
  } catch (error) {
    console.error("Error in products API:", error);
    return NextResponse.json(
      { error: "Internal server error", products: [], categories: [] },
      { status: 500 }
    );
  }
}
