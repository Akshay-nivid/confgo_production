import { Router } from 'express';
import { PlanController } from '../controllers/PlanController';

const router = Router();
const planController = new PlanController();

router.post('/list', (req, res, next) =>
  planController.getAllPlan(req, res, next)
);

export default router;
