import express from 'express';
import { SponsorTypeController } from "../controllers/SponsorTypeController";

const sponsorTypeController = new SponsorTypeController();
const router = express.Router();

router.post('/list', (req, res, next) =>
    sponsorTypeController.getSponsorTypeList(req, res, next)
);

export default router;