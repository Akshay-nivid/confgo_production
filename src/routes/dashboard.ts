import { Router } from 'express';
import { verifyToken } from '../middleware/jwtMiddleware';
import { DashBoardController } from '../controllers/DashBoardController';

const router = Router();

const dashBoardController = new DashBoardController();

router.get('/eventAndUserCount', verifyToken, (req, res, next) =>
  dashBoardController.eventAndUserCount(req, res, next)
);
router.post('/volunteerCount', verifyToken, (req, res, next) =>
  dashBoardController.fetchVolunteerDashboardCounts(req, res, next)
);
router.post('/countByEvent', verifyToken, (req, res, next) =>
  dashBoardController.countByEvent(req, res, next)
);
router.get('/abstractCount', verifyToken, (req, res, next) =>
  dashBoardController.abstractCountForReviewer(req, res, next)
);
router.post('/revenueCount', verifyToken, (req, res, next) =>
  dashBoardController.companyRevenueCount(req, res, next)
);
export default router;
