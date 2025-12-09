"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const client_1 = __importDefault(require("../prisma/client"));
class TransactionService {
    async getTransactions(params) {
        const { search, customerRegions, genders, ageMin, ageMax, productCategories, tags, paymentMethods, dateFrom, dateTo, sortBy = "date", sortOrder = "desc", page = 1, pageSize = 10 } = params;
        const skip = (page - 1) * pageSize;
        const where = {
            AND: []
        };
        const andConditions = where.AND;
        if (search) {
            andConditions.push({
                OR: [
                    { customerName: { contains: search, mode: "insensitive" } },
                    { phoneNumber: { contains: search, mode: "insensitive" } }
                ]
            });
        }
        if (customerRegions?.length) {
            andConditions.push({ customerRegion: { in: customerRegions } });
        }
        if (genders?.length) {
            andConditions.push({ gender: { in: genders } });
        }
        if (ageMin !== undefined) {
            andConditions.push({ age: { gte: ageMin } });
        }
        if (ageMax !== undefined) {
            andConditions.push({ age: { lte: ageMax } });
        }
        if (productCategories?.length) {
            andConditions.push({ productCategory: { in: productCategories } });
        }
        if (paymentMethods?.length) {
            andConditions.push({ paymentMethod: { in: paymentMethods } });
        }
        if (dateFrom) {
            andConditions.push({ date: { gte: new Date(dateFrom) } });
        }
        if (dateTo) {
            andConditions.push({ date: { lte: new Date(dateTo) } });
        }
        if (tags?.length) {
            andConditions.push({ tags: { hasSome: tags } });
        }
        if (andConditions.length === 0) {
            delete where.AND;
        }
        const sortColumnMap = {
            date: "date",
            quantity: "quantity",
            customerName: "customerName"
        };
        const orderBy = {
            [sortColumnMap[sortBy] || "date"]: sortOrder
        };
        const [data, totalItems] = await Promise.all([
            client_1.default.transaction.findMany({
                where,
                orderBy,
                skip,
                take: pageSize,
            }),
            client_1.default.transaction.count({ where })
        ]);
        return {
            data: data.map(item => ({
                ...item,
                id: item.id.toString() // Convert BigInt to string for JSON serialization
            })),
            totalItems,
            totalPages: Math.ceil(totalItems / pageSize),
            currentPage: page,
            pageSize: pageSize
        };
    }
}
exports.TransactionService = TransactionService;
