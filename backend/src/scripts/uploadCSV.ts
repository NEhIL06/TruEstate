import fs from "fs";
import path from "path";
import { Client } from "pg";
import { from as copyFrom } from "pg-copy-streams";
import { parse, format } from "fast-csv";
import dotenv from "dotenv";

dotenv.config();

async function main() {
    console.log("🔌 Connecting to database...");

    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    });

    await client.connect();

    // Disable statement timeout for this session to allow large uploads
    await client.query("SET statement_timeout = 0");

    console.log("🚀 Starting CSV upload using COPY...");

    const csvPath = path.join(__dirname, "../dataset.csv");
    console.log("CSV file path:", csvPath);

    if (!fs.existsSync(csvPath)) {
        console.error("❌ CSV file not found:", csvPath);
        process.exit(1);
    }

    // Define columns in the exact order expected by the COPY command
    const columns = [
        "transaction_id",
        "date",
        "customer_id",
        "customer_name",
        "phone_number",
        "gender",
        "age",
        "customer_region",
        "customer_type",
        "product_id",
        "product_name",
        "brand",
        "product_category",
        "tags",
        "quantity",
        "price_per_unit",
        "discount_percentage",
        "total_amount",
        "final_amount",
        "payment_method",
        "order_status",
        "delivery_type",
        "store_id",
        "store_location",
        "salesperson_id",
        "employee_name"
    ];

    const copyStream = client.query(
        copyFrom(`
      COPY "transactions" (
        ${columns.map(col => `"${col}"`).join(",\n        ")}
      )
      FROM STDIN WITH (FORMAT csv, HEADER true)
    `)
    );

    const fileStream = fs.createReadStream(csvPath);

    let isFirstRow = true;
    const transformStream = parse({ headers: true, ignoreEmpty: true, trim: true })
        .transform((row: any) => {
            if (isFirstRow) {
                console.log("First row keys:", Object.keys(row));
                isFirstRow = false;
            }

            // Map CSV headers to DB columns if necessary
            // We'll implement mapping after seeing the logs

            // Validate essential fields to prevent "null value in column..." errors
            // If date or transaction_id is missing, skip the row
            // Note: We might need to check row['Transaction ID'] instead of row.transaction_id
            const date = row.date || row['Date'];
            const transactionId = row.transaction_id || row['Transaction ID'];

            if (!date || !transactionId) {
                return null;
            }

            // Transform tags from "tag1,tag2" to "{tag1,tag2}" for PostgreSQL array format
            // Check both 'tags' and 'Tags'
            let tags = row.tags || row['Tags'];
            if (tags && !tags.startsWith("{")) {
                tags = `{${tags}}`;
            }

            // Construct a new row with correct keys matching DB columns
            return {
                transaction_id: transactionId,
                date: date,
                customer_id: row.customer_id || row['Customer ID'],
                customer_name: row.customer_name || row['Customer Name'],
                phone_number: row.phone_number || row['Phone Number'],
                gender: row.gender || row['Gender'],
                age: row.age || row['Age'],
                customer_region: row.customer_region || row['Customer Region'],
                customer_type: row.customer_type || row['Customer Type'],
                product_id: row.product_id || row['Product ID'],
                product_name: row.product_name || row['Product Name'],
                brand: row.brand || row['Brand'],
                product_category: row.product_category || row['Product Category'],
                tags: tags,
                quantity: row.quantity || row['Quantity'],
                price_per_unit: row.price_per_unit || row['Price Per Unit'],
                discount_percentage: row.discount_percentage || row['Discount Percentage'],
                total_amount: row.total_amount || row['Total Amount'],
                final_amount: row.final_amount || row['Final Amount'],
                payment_method: row.payment_method || row['Payment Method'],
                order_status: row.order_status || row['Order Status'],
                delivery_type: row.delivery_type || row['Delivery Type'],
                store_id: row.store_id || row['Store ID'],
                store_location: row.store_location || row['Store Location'],
                salesperson_id: row.salesperson_id || row['Salesperson ID'],
                employee_name: row.employee_name || row['Employee Name']
            };
        });

    const formatStream = format({ headers: columns, quote: '"' });

    fileStream
        .pipe(transformStream)
        .on("error", (err) => {
            console.error("❌ CSV Parsing error:", err);
            process.exit(1);
        })
        .pipe(formatStream)
        .on("error", (err) => {
            console.error("❌ CSV Formatting error:", err);
            process.exit(1);
        })
        .pipe(copyStream)
        .on("error", (err) => {
            console.error("❌ COPY stream error:", err);
            process.exit(1);
        })
        .on("finish", () => {
            console.log("✅ CSV upload completed successfully!");
            client.end();
        });
}

main().catch((err) => {
    console.error("❌ Fatal Error:", err);
    process.exit(1);
});
