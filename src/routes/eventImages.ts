import { Router } from "express";
import { EventImagesController } from "../controllers/EventImagesController";
import { verifyToken } from "../middleware/jwtMiddleware";

const router = Router();
const eventImagesController = new EventImagesController();

router.post('/upload', verifyToken, (req, res, next) =>
    eventImagesController.uploadEventImages(req, res, next)
);
router.post('/ListByEvent', verifyToken, (req, res, next) =>
    eventImagesController.getAllEventImages(req, res, next)
);
export default router;
