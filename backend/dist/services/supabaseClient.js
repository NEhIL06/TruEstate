"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sql = void 0;
const postgres_1 = __importDefault(require("postgres"));
const env_1 = require("../utils/env");
exports.sql = (0, postgres_1.default)(env_1.env.DATABASE_URL, {
    ssl: "require",
    max: 10,
    idle_timeout: 20,
});
