import express from 'express';
import { RoleController } from '../controllers/RoleController';
import { verifyToken } from '../middleware/jwtMiddleware';

const roleController = new RoleController();
const router = express.Router();

router.post('/',verifyToken, (req, res, next) =>
  roleController.addRole(req, res, next)
);
router.post('/list',verifyToken, (req, res, next) =>
  roleController.getRoleList(req, res, next)
);

export default router;
