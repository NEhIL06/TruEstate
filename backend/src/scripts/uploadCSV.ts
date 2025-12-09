import fs from "fs";
import path from "path";
import { Client } from "pg";
import { from as copyFrom } from "pg-copy-streams";
import { parse, format } from "fast-csv";
import dotenv from "dotenv";
import cliProgress from "cli-progress";

dotenv.config();

async function upload() {
  console.log("🔌 Connecting...");

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();

  console.log("📄 Counting total rows in CSV...");

  const csvPath = path.join(__dirname, "../dataset.csv");
  const totalRows = await countCSVRows(csvPath);

  console.log(`📊 Total rows detected: ${totalRows.toLocaleString()}`);

  // Setup progress bar
  const bar = new cliProgress.SingleBar(
    {
      format: "⏳ Uploading |{bar}| {percentage}% || {value}/{total} rows",
      barCompleteChar: "█",
      barIncompleteChar: "░",
    },
    cliProgress.Presets.shades_classic
  );

  bar.start(totalRows, 0);

  console.log("🚀 Preparing COPY command...");

  const copyStream = client.query(
    copyFrom(`
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
    `)
  );

  let processed = 0;

  fs.createReadStream(csvPath)
    .pipe(parse({ headers: true }))
    .transform((row:any) => {
      processed++;
      bar.update(processed);

      // Convert tags CSV ("organic,skincare") → PG array {organic,skincare}
      if (row.Tags) {
        const tags = row.Tags.replace(/"/g, ""); 
        const arr = tags.split(",").map((t:any) => t.trim());
        row.Tags = `{${arr.join(",")}}`;
      }

      return row;
    })
    .pipe(format({ headers: true }))
    .pipe(copyStream)
    .on("finish", () => {
      bar.stop();
      console.log("\n🎉 DONE — Import completed successfully.");
      client.end();
    })
    .on("error", (err) => {
      bar.stop();
      console.error("❌ COPY Error", err);
      client.end();
    });
}

// Count lines in CSV quickly (streaming, memory-efficient)
function countCSVRows(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    let count = 0;

    fs.createReadStream(filePath)
      .on("error", reject)
      .on("data", (chunk) => {
        for (let i = 0; i < chunk.length; ++i) {
          if (chunk[i] === 10) count++; // '\n'
        }
      })
      .on("end", () => {
        resolve(count - 1); // remove header line
      });
  });
}

upload();
