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

async function checkFileExists(url: string) {
  if (!url || url.includes("undefined")) return false;
  try {
    const res = await fetch(url, { method: "HEAD", signal: AbortSignal.timeout(2000) });
    return res.ok;
  } catch {
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

    const categoryPromises = CATEGORIES.map(async (category) => {
      try {
        const { data, error } = await supabase.storage.from(BUCKET_NAME).list(category, {
          limit: 20,
          sortBy: { column: 'name', order: 'asc' }
        });

        if (error) {
          console.error(`Error listing folder ${category}:`, error);
          return [];
        }

        if (!data || data.length === 0) {
          const fallbackChecks = FALLBACK_FILENAMES.map(async (filename, index) => {
            const url = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${category}/${filename}`;
            const exists = await checkFileExists(url);
            if (exists) {
              return {
                id: `${category}-fallback-${index}`,
                name: `${CATEGORY_LABELS[category]} #${index + 1}`,
                category,
                categoryLabel: CATEGORY_LABELS[category],
                image: url,
              };
            }
            return null;
          });

          const fallbackResults = await Promise.all(fallbackChecks);
          return fallbackResults.filter((p): p is Product => p !== null);
        }

        return data
          .filter((file) => file.name !== ".emptyFolderPlaceholder" && !file.metadata?.mimetype?.startsWith("directory"))
          .map((file, index) => ({
            id: `${category}-${index}-${file.id || file.name}`,
            name: `${CATEGORY_LABELS[category]} #${index + 1}`,
            category,
            categoryLabel: CATEGORY_LABELS[category],
            image: `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${category}/${file.name}`,
          }));
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
