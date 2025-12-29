import { NextResponse } from "next/server";

const SUPABASE_URL = "https://logewufqgmgxufkovpuw.supabase.co";
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

const CATEGORY_FILES: Record<Category, string[]> = {
  army: ["1.jpeg", "2.jpeg", "3.jpeg", "4.jpeg", "5.jpeg", "6.jpeg", "7.jpeg", "8.jpeg"],
  police: ["1.jpeg", "2.jpeg", "3.jpeg", "4.jpeg", "5.jpeg", "6.jpeg"],
  "bar-mat": ["1.jpeg", "2.jpeg", "3.jpeg", "4.jpeg", "5.jpeg"],
  coasters: ["1.jpeg", "2.jpeg", "3.jpeg", "4.jpeg", "5.jpeg", "6.jpeg"],
  "flash-memory": ["1.jpeg", "2.jpeg", "3.jpeg", "4.jpeg"],
  "fridge-magnet": ["1.jpeg", "2.jpeg", "3.jpeg", "4.jpeg", "5.jpeg"],
  label: ["1.jpeg", "2.jpeg", "3.jpeg", "4.jpeg", "5.jpeg", "6.jpeg"],
  lighter: ["1.jpeg", "2.jpeg", "3.jpeg", "4.jpeg"],
  "mobile-holder": ["1.jpeg", "2.jpeg", "3.jpeg", "4.jpeg"],
  "pen-accessories": ["1.jpeg", "2.jpeg", "3.jpeg", "4.jpeg", "5.jpeg"],
};

function formatProductName(filename: string, category: Category): string {
  const index = filename.replace(/\.(jpg|jpeg|png|gif|webp)$/i, "");
  return `${CATEGORY_LABELS[category]} #${index}`;
}

export async function GET() {
  try {
    const allProducts: Product[] = [];

    for (const category of CATEGORIES) {
      const files = CATEGORY_FILES[category];
      files.forEach((filename, index) => {
        allProducts.push({
          id: `${category}-${index}-${filename}`,
          name: formatProductName(filename, category),
          category,
          categoryLabel: CATEGORY_LABELS[category],
          image: `${PUBLIC_URL}/${category}/${filename}`,
        });
      });
    }

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
