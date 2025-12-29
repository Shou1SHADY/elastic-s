import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const BUCKET_NAME = "corporate";
const PUBLIC_URL = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}`;

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

function formatProductName(filename: string, category: Category): string {
  const name = filename
    .replace(/\.[^/.]+$/, "") // Remove extension
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  
  return name.length > 2 ? name : `${CATEGORY_LABELS[category]} Product`;
}

export async function GET() {
  try {
    const allProducts: Product[] = [];

    // Fetch files from Supabase Storage for each category
    const results = await Promise.all(
      CATEGORIES.map(async (category) => {
        const { data, error } = await supabase.storage
          .from(BUCKET_NAME)
          .list(category, {
            limit: 100,
            offset: 0,
            sortBy: { column: 'name', order: 'asc' },
          });

        console.log(`List result for ${category}:`, { count: data?.length, error: error?.message });

        if (error) {
          console.error(`Error listing files for category ${category}:`, JSON.stringify(error, null, 2));
          return [];
        }

        // Filter out folders (if any) and non-image files
        return (data || [])
          .filter(file => file.name !== '.emptyFolderPlaceholder' && /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name))
          .map(file => ({
            id: `${category}-${file.id || file.name}`,
            name: formatProductName(file.name, category),
            category,
            categoryLabel: CATEGORY_LABELS[category],
            image: `${PUBLIC_URL}/${category}/${file.name}`,
          }));
      })
    );

    results.forEach(products => {
      allProducts.push(...products);
    });

    return NextResponse.json({
      products: allProducts,
      categories: CATEGORIES.map((id) => ({ id, label: CATEGORY_LABELS[id] })),
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products", products: [], categories: [] },
      { status: 500 }
    );
  }
}
