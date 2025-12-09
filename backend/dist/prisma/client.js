"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("../../generated/prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const adapter = new adapter_pg_1.PrismaPg({
    connectionString: process.env.DATABASE_URL,
});
const globalForPrisma = global;
const prisma = globalForPrisma.prisma || new client_1.PrismaClient({
    adapter,
});
if (process.env.NODE_ENV !== "production")
    globalForPrisma.prisma = prisma;
exports.default = prisma;
