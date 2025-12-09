-- CreateTable
CREATE TABLE "transactions" (
    "id" BIGSERIAL NOT NULL,
    "transaction_id" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "customer_id" TEXT,
    "customer_name" TEXT,
    "phone_number" TEXT,
    "gender" TEXT,
    "age" INTEGER,
    "customer_region" TEXT,
    "customer_type" TEXT,
    "product_id" TEXT,
    "product_name" TEXT,
    "brand" TEXT,
    "product_category" TEXT,
    "tags" TEXT[],
    "quantity" INTEGER,
    "price_per_unit" DOUBLE PRECISION,
    "discount_percentage" DOUBLE PRECISION,
    "total_amount" DOUBLE PRECISION,
    "final_amount" DOUBLE PRECISION,
    "payment_method" TEXT,
    "order_status" TEXT,
    "delivery_type" TEXT,
    "store_id" TEXT,
    "store_location" TEXT,
    "salesperson_id" TEXT,
    "employee_name" TEXT,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "transactions_customer_name_idx" ON "transactions"("customer_name");

-- CreateIndex
CREATE INDEX "transactions_phone_number_idx" ON "transactions"("phone_number");

-- CreateIndex
CREATE INDEX "transactions_customer_region_idx" ON "transactions"("customer_region");

-- CreateIndex
CREATE INDEX "transactions_gender_idx" ON "transactions"("gender");

-- CreateIndex
CREATE INDEX "transactions_age_idx" ON "transactions"("age");

-- CreateIndex
CREATE INDEX "transactions_product_category_idx" ON "transactions"("product_category");

-- CreateIndex
CREATE INDEX "transactions_payment_method_idx" ON "transactions"("payment_method");

-- CreateIndex
CREATE INDEX "transactions_date_idx" ON "transactions"("date");

-- CreateIndex
CREATE INDEX "transactions_quantity_idx" ON "transactions"("quantity");

-- CreateIndex
CREATE INDEX "transactions_customer_name_date_idx" ON "transactions"("customer_name", "date");

-- CreateIndex
CREATE INDEX "transactions_product_id_idx" ON "transactions"("product_id");

-- CreateIndex
CREATE INDEX "transactions_salesperson_id_idx" ON "transactions"("salesperson_id");

-- CreateIndex
CREATE INDEX "transactions_tags_idx" ON "transactions" USING GIN ("tags");
