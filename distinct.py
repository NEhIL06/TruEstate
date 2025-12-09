import csv
import os

CSV_PATH = "backend/src/dataset.csv"  # change if needed

def extract_distinct_values(csv_path):
    if not os.path.exists(csv_path):
        print(f"❌ File not found: {csv_path}")
        return

    print("📄 Reading CSV and extracting distinct values...")

    categories = set()
    regions = set()
    tags = set()
    payment_methods = set()

    with open(csv_path, mode="r", encoding="utf-8") as file:
        reader = csv.DictReader(file)

        for row in reader:
            # --- Product Category ---
            cat = row.get("Product Category")
            if cat and cat.strip():
                categories.add(cat.strip())

            # --- Customer Region ---
            region = row.get("Customer Region")
            if region and region.strip():
                regions.add(region.strip())

            # --- Tags (comma-separated) ---
            raw_tags = row.get("Tags")
            if raw_tags:
                cleaned = raw_tags.replace('"', "")  # remove quotes: "a,b" → a,b
                for tag in cleaned.split(","):
                    t = tag.strip().lower()
                    if t:
                        tags.add(t)

            # --- Payment Method ---
            pay = row.get("Payment Method")
            if pay and pay.strip():
                payment_methods.add(pay.strip())

    # ---- OUTPUT ----
    print("\n🔥 DISTINCT PRODUCT CATEGORIES:")
    for c in sorted(categories):
        print("-", c)

    print("\n🌍 DISTINCT CUSTOMER REGIONS:")
    for r in sorted(regions):
        print("-", r)

    print("\n🏷 DISTINCT TAGS:")
    for t in sorted(tags):
        print("-", t)

    print("\n💳 DISTINCT PAYMENT METHODS:")
    for p in sorted(payment_methods):
        print("-", p)

    print("\n✅ Done!")


if __name__ == "__main__":
    extract_distinct_values(CSV_PATH)
