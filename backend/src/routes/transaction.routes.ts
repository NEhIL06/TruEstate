import { Router } from "express";
import { getTransactionsController } from "../controllers/transaction.controller";

const router = Router();

router.get("/transactions", getTransactionsController);

export default router;
