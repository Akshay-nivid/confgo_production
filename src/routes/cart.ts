import { Router } from 'express';
import { CartController } from '../controllers/CartController';
import { optionalVerifyToken } from '../middleware/jwtMiddleware';
const router = Router();
const cartController = new CartController();

router.post('/', optionalVerifyToken, (req, res, next) =>
  cartController.createCart(req, res, next)
);
router.put('/:id', optionalVerifyToken, (req, res, next) =>
  cartController.updateCart(req, res, next)
);
router.get('/:id', optionalVerifyToken, (req, res, next) =>
  cartController.getCartDetailById(req, res, next)
);

export default router;
