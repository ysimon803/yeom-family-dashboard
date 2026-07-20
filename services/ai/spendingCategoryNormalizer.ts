export const SPENDING_CATEGORIES = [
  "Housing & Utilities",
  "Groceries",
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Health & Medical",
  "Kids & Education",
  "Travel",
  "Personal Care",
  "Insurance",
  "Fees & Charges",
  "Other",
] as const;

export type NormalizedSpendingCategory =
  (typeof SPENDING_CATEGORIES)[number];

const CATEGORY_RULES: Array<{
  category: NormalizedSpendingCategory;
  keywords: string[];
}> = [
  {
    category: "Housing & Utilities",
    keywords: [
      "rent",
      "mortgage",
      "home",
      "utilities",
      "utility",
      "electric",
      "electricity",
      "water",
      "gas",
      "internet",
      "cable",
      "phone",
      "mobile",
      "sewer",
      "trash",
      "property tax",
      "hoa",
    ],
  },
  {
    category: "Groceries",
    keywords: [
      "groceries",
      "grocery",
      "supermarket",
      "food store",
      "warehouse club",
      "costco",
      "sam's club",
      "sams club",
    ],
  },
  {
    category: "Food & Dining",
    keywords: [
      "food and drink",
      "restaurant",
      "restaurants",
      "fast food",
      "coffee",
      "cafe",
      "bakery",
      "bar",
      "dining",
      "delivery",
    ],
  },
  {
    category: "Transportation",
    keywords: [
      "transportation",
      "gasoline",
      "fuel",
      "parking",
      "toll",
      "rideshare",
      "uber",
      "lyft",
      "taxi",
      "public transit",
      "vehicle",
      "automotive",
      "car repair",
      "auto repair",
    ],
  },
  {
    category: "Shopping",
    keywords: [
      "general merchandise",
      "shopping",
      "department store",
      "clothing",
      "electronics",
      "online marketplace",
      "retail",
      "amazon",
    ],
  },
  {
    category: "Entertainment",
    keywords: [
      "entertainment",
      "recreation",
      "movie",
      "movies",
      "streaming",
      "music",
      "gaming",
      "sports",
      "amusement",
      "subscription",
    ],
  },
  {
    category: "Health & Medical",
    keywords: [
      "medical",
      "healthcare",
      "health",
      "doctor",
      "dentist",
      "dental",
      "pharmacy",
      "hospital",
      "vision",
      "optical",
      "therapy",
    ],
  },
  {
    category: "Kids & Education",
    keywords: [
      "education",
      "school",
      "tuition",
      "childcare",
      "daycare",
      "kids",
      "children",
      "books",
      "learning",
      "camp",
    ],
  },
  {
    category: "Travel",
    keywords: [
      "travel",
      "airlines",
      "airline",
      "flight",
      "hotel",
      "lodging",
      "rental car",
      "vacation",
    ],
  },
  {
    category: "Personal Care",
    keywords: [
      "personal care",
      "hair",
      "salon",
      "spa",
      "beauty",
      "cosmetics",
      "barber",
      "laundry",
      "dry cleaning",
    ],
  },
  {
    category: "Insurance",
    keywords: [
      "insurance",
      "life insurance",
      "auto insurance",
      "home insurance",
      "health insurance",
    ],
  },
  {
    category: "Fees & Charges",
    keywords: [
      "bank fee",
      "fee",
      "fees",
      "late charge",
      "service charge",
      "interest charge",
      "atm fee",
      "overdraft",
    ],
  },
];

function cleanCategoryText(
  value: string | null | undefined,
): string {
  return (
    value
      ?.replace(/_/g, " ")
      .replace(/-/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase() ?? ""
  );
}

export function normalizeSpendingCategory(
  ...categoryValues: Array<
    string | null | undefined
  >
): NormalizedSpendingCategory {
  const combinedCategory = categoryValues
    .map(cleanCategoryText)
    .filter(Boolean)
    .join(" ");

  if (!combinedCategory) {
    return "Other";
  }

  for (const rule of CATEGORY_RULES) {
    const matched = rule.keywords.some((keyword) =>
      combinedCategory.includes(keyword),
    );

    if (matched) {
      return rule.category;
    }
  }

  return "Other";
}