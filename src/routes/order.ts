import { Router } from 'express';
import { OrderController } from '../controllers/OrderController';
import { verifyToken } from '../middleware/jwtMiddleware';
const router = Router();
const orderController = new OrderController();

router.post('/', verifyToken, (req, res, next) =>
  orderController.createOrder(req, res, next)
);
router.get('/:id', verifyToken, (req, res, next) =>
  orderController.getOrderDetailById(req, res, next)
);
router.post('/list', verifyToken, (req, res, next) =>
  orderController.orderList(req, res, next)
);
router.put('/update/:id', verifyToken, (req, res, next) =>
  orderController.updateOrder(req, res, next)
);
export default router;
