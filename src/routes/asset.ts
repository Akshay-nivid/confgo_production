import express from 'express';
import { AssetController } from '../controllers/AssetController';
import { verifyToken } from '../middleware/jwtMiddleware';

const assetController = new AssetController();
const router = express.Router();

router.post('/', verifyToken, (req, res, next) =>
  assetController.uploadAsset(req, res, next)
);

router.post('/list', verifyToken, (req, res, next) =>
  assetController.getAllAssets(req, res, next)
);

router.get('/:id', (req, res, next) =>
  assetController.getAsset(req, res, next)
);
export default router;
