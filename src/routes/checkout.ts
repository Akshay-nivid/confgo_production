import { Router } from 'express';
import { CheckOutController } from '../controllers/CheckOutController';

const router = Router();

const checkOutController = new CheckOutController();

router.post('/', (req, res, next) =>
  checkOutController.checkOut(req, res, next)
);

export default router;
