import { Router } from "express";
import { WalletController } from "../controllers/wallet.controller";
import { authMiddleware, requireRole } from "../middlewares/auth.middleware";

const walletRoutes = Router();
const controller = new WalletController();

walletRoutes.get("/balance", authMiddleware, controller.balance);
walletRoutes.post("/deposit", authMiddleware, controller.deposit);
walletRoutes.post("/withdraw", authMiddleware, controller.withdraw);
walletRoutes.get("/history", authMiddleware, controller.history);
walletRoutes.get("/escrow", authMiddleware, controller.escrowList);
walletRoutes.post("/hold", authMiddleware, controller.hold);
walletRoutes.post("/release", authMiddleware, controller.release);
walletRoutes.post("/cancel", authMiddleware, controller.cancel);
walletRoutes.get("/transactions", authMiddleware, requireRole(["admin"]), controller.allTransactions);

export { walletRoutes };
