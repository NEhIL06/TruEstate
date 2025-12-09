"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFoundHandler = exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode = 500, details) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
    }
}
exports.AppError = AppError;
const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        error: "Route not found"
    });
};
exports.notFoundHandler = notFoundHandler;
const errorHandler = (err, res) => {
    console.error(err);
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            error: err.message,
            details: err.details ?? null
        });
    }
    return res.status(500).json({
        success: false,
        error: "Internal server error"
    });
};
exports.errorHandler = errorHandler;
