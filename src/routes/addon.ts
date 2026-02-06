import { Router } from 'express';
import { AddOnController } from '../controllers/AddonController';
import { verifyToken } from '../middleware/jwtMiddleware';

const router = Router();

const addonController = new AddOnController();

router.post('/list', verifyToken, (req, res, next) =>
  addonController.getAllAddon(req, res, next)
);

router.post('/', verifyToken, (req, res, next) =>
  addonController.createAddon(req, res, next)
);

export default router;
