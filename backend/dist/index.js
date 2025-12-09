"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const env_1 = require("./utils/env");
const transaction_routes_1 = __importDefault(require("./routes/transaction.routes"));
const errors_1 = require("./utils/errors");
const app = (0, express_1.default)();
const origin = [
    "http://localhost:3000",
    process.env.FRONTEND_URL
];
app.use((0, cors_1.default)({
    origin: origin,
    credentials: true
}));
app.use(express_1.default.json());
app.get("/health", (_req, res) => {
    return res.json({ status: "ok" });
});
app.use("/api", transaction_routes_1.default);
app.use(errors_1.notFoundHandler);
app.use(errors_1.errorHandler);
app.listen(env_1.env.PORT, () => {
    console.log(`Backend running on http://localhost:${env_1.env.PORT}`);
});
exports.default = app;
