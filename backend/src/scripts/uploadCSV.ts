
import fs from "fs";
import path from "path";
import { Client } from "pg";
import { from as copyFrom } from "pg-copy-streams";
import { parse } from "fast-csv";
import dotenv from "dotenv";

dotenv.config();

const CHUNK_SIZE = 20_000;                     
const TEMP_DIR = path.join(__dirname, "chunks");

if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}
function sanitizeTags(raw: string | null | undefined): string {
  if (!raw || raw.trim() === "") return "{}";

  const cleaned = raw
    .replace(/"/g, "")              
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t.length > 0);

  if (!cleaned.length) return "{}";

  return `{${cleaned.join(",")}}`;
}

function toCSVField(value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  const str = String(value);
  const escaped = str.replace(/"/g, '""');      

  return `"${escaped}"`;
}

function sanitizeRow(row: any): string {
  const tagsLiteral = sanitizeTags(row["Tags"]);

  const orderedValues = [
    row["Transaction ID"],     // transaction_id
    row["Date"],               // date
    row["Customer ID"],        // customer_id
    row["Customer Name"],      // customer_name
    row["Phone Number"],       // phone_number
    row["Gender"],             // gender
    row["Age"],                // age
    row["Customer Region"],    // customer_region
    row["Customer Type"],      // customer_type
    row["Product ID"],         // product_id
    row["Product Name"],       // product_name
    row["Brand"],              // brand
    row["Product Category"],   // product_category
    tagsLiteral,               // tags (Postgres array literal)
    row["Quantity"],           // quantity
    row["Price per Unit"],     // price_per_unit
    row["Discount Percentage"],// discount_percentage
    row["Total Amount"],       // total_amount
    row["Final Amount"],       // final_amount
    row["Payment Method"],     // payment_method
    row["Order Status"],       // order_status
    row["Delivery Type"],      // delivery_type
    row["Store ID"],           // store_id
    row["Store Location"],     // store_location
    row["Salesperson ID"],     // salesperson_id
    row["Employee Name"],      // employee_name
  ];

  const csvFields = orderedValues.map(toCSVField);
  return csvFields.join(",");
}


function writeChunk(filename: string, rows: string[]): void {
  const header = [
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
    "employee_name",
  ].join(",");

  const content = header + "\n" + rows.join("\n");
  fs.writeFileSync(filename, content, { encoding: "utf8" });
}


async function createChunks(csvPath: string): Promise<{ chunkFiles: string[]; totalRows: number }> {
  console.log("Reading CSV and creating chunks...");

  const chunkFiles: string[] = [];
  let buffer: string[] = [];
  let chunkIndex = 0;
  let totalRows = 0;

  return new Promise((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(parse({ headers: true }))
      .on("error", (err) => reject(err))
      .on("data", (row) => {
        const line = sanitizeRow(row);
        buffer.push(line);
        totalRows++;

        if (buffer.length >= CHUNK_SIZE) {
          const file = path.join(TEMP_DIR, `chunk_${chunkIndex}.csv`);
          writeChunk(file, buffer);
          chunkFiles.push(file);
          console.log("Created chunk ${chunkIndex}");
          buffer = [];
          chunkIndex++;
        }
      })
      .on("end", () => {
        if (buffer.length > 0) {
          const file = path.join(TEMP_DIR, `chunk_${chunkIndex}.csv`);
          writeChunk(file, buffer);
          chunkFiles.push(file);
          console.log("Created chunk ${chunkIndex}");
        }

        console.log(`Total rows: ${totalRows}. Total chunks: ${chunkFiles.length}`);
        resolve({ chunkFiles, totalRows });
      });
  });
}

async function uploadChunk(client: Client, file: string, index: number, totalChunks: number) {
  console.log(`⏳ Uploading chunk ${index + 1}/${totalChunks}...`);

  const copySql = `
    COPY transactions (
      transaction_id,
      date,
      customer_id,
      customer_name,
      phone_number,
      gender,
      age,
      customer_region,
      customer_type,
      product_id,
      product_name,
      brand,
      product_category,
      tags,
      quantity,
      price_per_unit,
      discount_percentage,
      total_amount,
      final_amount,
      payment_method,
      order_status,
      delivery_type,
      store_id,
      store_location,
      salesperson_id,
      employee_name
    )
    FROM STDIN WITH (FORMAT csv, HEADER true)
  `;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await new Promise<void>((resolve, reject) => {
        const stream = client.query(copyFrom(copySql));

        fs.createReadStream(file)
          .on("error", (err) => reject(err))
          .pipe(stream)
          .on("finish", () => resolve())
          .on("error", (err) => reject(err));
      });

      console.log(` Chunk ${index + 1}/${totalChunks} uploaded successfully`);
      return;
    } catch (err: any) {
      console.error(` Chunk ${index + 1} failed (attempt ${attempt}):`, err?.message || err);

      if (attempt === 3) {
        console.error(` Chunk ${index + 1} failed permanently. File: ${file}`);
        throw err;
      } else {
        console.log(`Retrying chunk ${index + 1}...`);
      }
    }
  }
}



async function startUpload() {
  const csvPath = path.join(__dirname, "../dataset.csv");

  if (!fs.existsSync(csvPath)) {
    console.error(" CSV file not found at:", csvPath);
    process.exit(1);
  }

  if (!process.env.DATABASE_URL) {
    console.error(" DATABASE_URL is not set in .env");
    process.exit(1);
  }

  if (process.env.DATABASE_URL.includes("pooler.supabase.com")) {
    console.warn(" WARNING: You are using the Supabase pooler URL.");
    console.warn("   For bulk COPY, use the primary DB URL with host 'db.<ref>.supabase.co' and port 5432.");
  }

  console.log(" Connecting to Supabase primary DB...");

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();

  const { chunkFiles, totalRows } = await createChunks(csvPath);
  const totalChunks = chunkFiles.length;

  console.log(` Starting upload of ${totalChunks} chunks (${totalRows.toLocaleString()} rows)...`);

  for (let i = 0; i < totalChunks; i++) {
    await uploadChunk(client, chunkFiles[i], i, totalChunks);
  }

  console.log(" ALL CHUNKS UPLOADED SUCCESSFULLY");
  await client.end();
}

startUpload().catch((err) => {
  console.error("Fatal Error:", err);
  process.exit(1);
});
