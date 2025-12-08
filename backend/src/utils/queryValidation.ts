import { z } from "zod";
import { AppError } from "./errors";
import { TransactionQueryParams } from "../models/transaction";

const csvToArray = (value: unknown) => {
  if (typeof value !== "string") return [];
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
};

export const transactionQuerySchema = z
  .object({
    search: z.string().trim().optional(),
    customerRegions: z.preprocess(csvToArray, z.array(z.string()).optional()),
    genders: z.preprocess(csvToArray, z.array(z.string()).optional()),
    productCategories: z.preprocess(
      csvToArray,
      z.array(z.string()).optional()
    ),
    tags: z.preprocess(csvToArray, z.array(z.string()).optional()),
    paymentMethods: z.preprocess(csvToArray, z.array(z.string()).optional()),

    ageMin: z
      .preprocess((v) => (v === undefined ? undefined : Number(v)), z.number().int().min(0).optional()),
    ageMax: z
      .preprocess((v) => (v === undefined ? undefined : Number(v)), z.number().int().min(0).optional()),

    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),

    sortBy: z.enum(["date", "quantity", "customerName"]).optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),

    page: z
      .preprocess((v) => (v === undefined ? 1 : Number(v)), z.number().int().min(1))
      .optional(),
    pageSize: z
      .preprocess((v) => (v === undefined ? 10 : Number(v)), z.number().int().min(1).max(100))
      .optional()
  })
  .superRefine((data, ctx) => {
    if (data.ageMin !== undefined && data.ageMax !== undefined) {
      if (data.ageMin > data.ageMax) {
        ctx.addIssue({
          code: "custom",
          message: "ageMin cannot be greater than ageMax",
          path: ["ageMin"]
        });
      }
    }

    if (data.dateFrom && data.dateTo) {
      const from = new Date(data.dateFrom);
      const to = new Date(data.dateTo);

      if (isNaN(from.getTime()) || isNaN(to.getTime())) {
        ctx.addIssue({
          code: "custom",
          message: "Invalid date format",
          path: ["dateFrom"]
        });
      } else if (from > to) {
        ctx.addIssue({
          code: "custom",
          message: "dateFrom cannot be greater than dateTo",
          path: ["dateFrom"]
        });
      }
    }
  });

export function validateTransactionQuery(raw: any): TransactionQueryParams {
  const parsed = transactionQuerySchema.safeParse(raw);

  if (!parsed.success) {
    throw new AppError("Invalid query parameters", 400, z.treeifyError(parsed.error));
  }

  const {search,customerRegions,genders,ageMin,ageMax,productCategories,tags,paymentMethods,dateFrom,dateTo,sortBy = "date",sortOrder = "desc",page = 1,pageSize = 10} = parsed.data;

  return {
    search,
    customerRegions,
    genders,
    ageMin,
    ageMax,
    productCategories,
    tags,
    paymentMethods,
    dateFrom,
    dateTo,
    sortBy,
    sortOrder,
    page,
    pageSize
  };
}
