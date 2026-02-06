import { Router } from 'express';
import { PaymentController } from '../controllers/PaymentController';
import { verifyToken } from '../middleware/jwtMiddleware';

const router = Router();
const paymentController = new PaymentController();

router.post('/', verifyToken, (req, res, next) =>
  paymentController.createPayment(req, res, next)
);
router.post('/subscription', (req, res, next) =>
  paymentController.createSubscriptionPayment(req, res, next)
);
router.post('/subscription/list', verifyToken, (req, res, next) =>
  paymentController.subscriptionpaymentList(req, res, next)
);

router.post('/method', (req, res, next) =>
  paymentController.createPaymentMethod(req, res, next)
);
router.post('/method/list', (req, res, next) =>
  paymentController.getAllPaymentMethods(req, res, next)
);
router.post('/list', verifyToken, (req, res, next) =>
  paymentController.paymentList(req, res, next)
);
router.put('/update/:id', verifyToken, (req, res, next) =>
  paymentController.updatePayment(req, res, next)
);
router.put('/subscription/update/:id', verifyToken, (req, res, next) =>
  paymentController.updateSubscriptionPayment(req, res, next)
);

export default router;
