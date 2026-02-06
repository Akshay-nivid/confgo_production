import { CompanyPaypalConfigurationController } from '../controllers/CompanyPaypalConfigurationController';
import express from 'express';
import { verifyToken } from '../middleware/jwtMiddleware';

const paypalConfigController = new CompanyPaypalConfigurationController();
const router = express.Router();

router.post('/', verifyToken, (req, res, next) =>
  paypalConfigController.createPaypalConfig(req, res, next)
);

router.get('/', verifyToken, (req, res, next) =>
  paypalConfigController.getPaypalConfigById(req, res, next)
);

router.put('/:id', verifyToken, (req, res, next) =>
  paypalConfigController.updatePaypalConfig(req, res, next)
);

router.post('/list', verifyToken, (req, res, next) =>
  paypalConfigController.paypalConfigList(req, res, next)
);

export default router;
