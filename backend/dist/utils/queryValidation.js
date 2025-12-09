"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionQuerySchema = void 0;
exports.validateTransactionQuery = validateTransactionQuery;
const zod_1 = require("zod");
const errors_1 = require("./errors");
const csvToArray = (value) => {
    if (typeof value !== "string")
        return [];
    return value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
};
exports.transactionQuerySchema = zod_1.z
    .object({
    search: zod_1.z.string().trim().optional(),
    customerRegions: zod_1.z.preprocess(csvToArray, zod_1.z.array(zod_1.z.string()).optional()),
    genders: zod_1.z.preprocess(csvToArray, zod_1.z.array(zod_1.z.string()).optional()),
    productCategories: zod_1.z.preprocess(csvToArray, zod_1.z.array(zod_1.z.string()).optional()),
    tags: zod_1.z.preprocess(csvToArray, zod_1.z.array(zod_1.z.string()).optional()),
    paymentMethods: zod_1.z.preprocess(csvToArray, zod_1.z.array(zod_1.z.string()).optional()),
    ageMin: zod_1.z
        .preprocess((v) => (v === undefined ? undefined : Number(v)), zod_1.z.number().int().min(0).optional()),
    ageMax: zod_1.z
        .preprocess((v) => (v === undefined ? undefined : Number(v)), zod_1.z.number().int().min(0).optional()),
    dateFrom: zod_1.z.string().optional(),
    dateTo: zod_1.z.string().optional(),
    sortBy: zod_1.z.enum(["date", "quantity", "customerName"]).optional(),
    sortOrder: zod_1.z.enum(["asc", "desc"]).optional(),
    page: zod_1.z
        .preprocess((v) => (v === undefined ? 1 : Number(v)), zod_1.z.number().int().min(1))
        .optional(),
    pageSize: zod_1.z
        .preprocess((v) => (v === undefined ? 10 : Number(v)), zod_1.z.number().int().min(1).max(100))
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
        }
        else if (from > to) {
            ctx.addIssue({
                code: "custom",
                message: "dateFrom cannot be greater than dateTo",
                path: ["dateFrom"]
            });
        }
    }
});
function validateTransactionQuery(raw) {
    const parsed = exports.transactionQuerySchema.safeParse(raw);
    if (!parsed.success) {
        throw new errors_1.AppError("Invalid query parameters", 400, zod_1.z.treeifyError(parsed.error));
    }
    const { search, customerRegions, genders, ageMin, ageMax, productCategories, tags, paymentMethods, dateFrom, dateTo, sortBy = "date", sortOrder = "desc", page = 1, pageSize = 10 } = parsed.data;
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
