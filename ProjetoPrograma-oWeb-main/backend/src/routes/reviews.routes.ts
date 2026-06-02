import { Router } from "express";
import { ReviewsController } from "../controllers/reviews.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const reviewsRoutes = Router();
const controller = new ReviewsController();

reviewsRoutes.post("/", authMiddleware, controller.create);
reviewsRoutes.get("/service/:serviceId", controller.findByService);
reviewsRoutes.get("/provider/:providerId", controller.findByProvider);

export { reviewsRoutes };
