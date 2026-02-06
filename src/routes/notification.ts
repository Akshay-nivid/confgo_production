import { Router } from 'express';
import { NotificationController } from '../controllers/NotificationController';
import { verifyToken } from '../middleware/jwtMiddleware';

const router = Router();
const notificationController = new NotificationController();

router.post('/contact', (req, res, next) =>
  notificationController.sendContactusEmail(req, res, next)
);

router.post('/list', (req, res, next) =>
  notificationController.listNotifications(req, res, next)
);
router.post('/emailInivte',verifyToken, (req, res, next) =>
  notificationController.inviteUsersByEmail(req, res, next)
);
router.post('/sponsorshipInterest', (req, res, next) =>
  notificationController.sponsorshipInterestMail(req, res, next)
);

export default router;
