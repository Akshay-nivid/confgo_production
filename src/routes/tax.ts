import { Router } from 'express';
import { verifyToken } from '../middleware/jwtMiddleware';
import { TaxController } from '../controllers/TaxController';

const router = Router();
const taxController = new TaxController();

router.post('/', verifyToken, (req, res, next) =>
    taxController.createCompanyTax(req, res, next)
);

router.post('/list', verifyToken, (req, res, next) =>
    taxController.getAllTaxes(req, res, next)
);

router.put('/:id', verifyToken, (req, res, next) =>
    taxController.updateTax(req, res, next)
);
export default router;
