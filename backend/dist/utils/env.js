"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    PORT: zod_1.z.string().default("4000"),
    DATABASE_URL: zod_1.z.url(),
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    console.error("Invalid environment variables:", zod_1.z.treeifyError(parsed.error));
    process.exit(1);
}
exports.env = {
    PORT: parseInt(parsed.data.PORT, 10),
    DATABASE_URL: parsed.data.DATABASE_URL,
};
