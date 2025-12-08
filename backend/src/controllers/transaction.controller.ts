import { Request, Response, NextFunction } from "express";
import { validateTransactionQuery } from "../utils/queryValidation";
import { TransactionService } from "../services/transaction.service";

const transactionService = new TransactionService();

export const getTransactionsController = async (req: Request,res: Response,next: NextFunction) => {
  try {
    const validatedParams = validateTransactionQuery(req.query);

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
  } catch (err) {
    next(err as Error);
  }
};
