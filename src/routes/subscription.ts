import { Router } from 'express';
import { SubscriptionController } from '../controllers/SubscriptionController';
import { verifyToken } from '../middleware/jwtMiddleware';

const router = Router();
const subscriptionController = new SubscriptionController();

router.post('/verify', verifyToken, (req, res, next) =>
  subscriptionController.verifyUserSubscription(req, res, next)
);

router.post('/', verifyToken, (req, res, next) =>
  subscriptionController.createSubscription(req, res, next)
);

export default router;
