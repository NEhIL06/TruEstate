"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionsController = void 0;
const queryValidation_1 = require("../utils/queryValidation");
const transaction_service_1 = require("../services/transaction.service");
const transactionService = new transaction_service_1.TransactionService();
const getTransactionsController = async (req, res, next) => {
    try {
        const validatedParams = (0, queryValidation_1.validateTransactionQuery)(req.query);
        const result = await transactionService.getTransactions(validatedParams);
        return res.status(200).json({
            success: true,
            data: result.data,
            meta: {
                totalItems: result.totalItems,
                totalPages: result.totalPages,
                currentPage: result.currentPage,
                pageSize: result.pageSize
            }
        });
    }
    catch (err) {
        next(err);
    }
};
exports.getTransactionsController = getTransactionsController;
