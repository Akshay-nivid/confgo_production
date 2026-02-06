/**
 * Auth Routes
 * Author: sarathavs
 */
import express from 'express';
import { AuthController } from '../controllers/AuthController';

const authController = new AuthController();
const router = express.Router();

// POST /auth - Authenticate and get token
router.post('/login', (req, res, next) =>
  authController.authenticate(req, res, next)
);
router.post('/ssoLogin', (req, res, next) =>
  authController.ssoAuthenticate(req, res, next)
);
router.post('/refreshToken', (req, res, next) =>
  authController.refreshTokenHandler(req, res, next)
);

export default router;
