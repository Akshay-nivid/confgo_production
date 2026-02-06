import { Router } from 'express';
import { CouponController } from '../controllers/CouponController';
import { verifyToken } from '../middleware/jwtMiddleware';
const router = Router();
const couponController = new CouponController();

router.post('/', (req, res, next) =>
  couponController.createCoupon(req, res, next)
);
router.post('/list', (req, res, next) =>
  couponController.getAllCoupons(req, res, next)
);
router.put('/:id', (req, res, next) =>
  couponController.updateCoupon(req, res, next)
);
router.post('/status/list', (req, res, next) =>
  couponController.getAllCouponStatus(req, res, next)
);
router.get('/:id', (req, res, next) =>
  couponController.getCouponById(req, res, next)
);
router.delete('/:id', (req, res, next) =>
  couponController.deleteCoupon(req, res, next)
);
router.post('/applyCoupon', verifyToken, (req, res, next) =>
  couponController.applyCoupon(req, res, next)
);
router.post('/removeCoupon', (req, res, next) =>
  couponController.removeCoupon(req, res, next)
);
export default router;
