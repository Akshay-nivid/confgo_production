import { Router } from 'express';
import { SpecialtyController } from '../controllers/SpecialtyController';

const router = Router();
const specialtyController = new SpecialtyController();

router.post('/list', (req, res, next) =>
specialtyController.getAllSpecialties(req, res, next)
);

export default router;
