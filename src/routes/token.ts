import { Router } from 'express';
import { TokenController } from '../controllers/TokenController';

const router = Router();
const tokenController = new TokenController();

router.post('/', (req, res, next) =>
  tokenController.createToken(req, res, next)
);

router.post('/otp', (req, res, next) =>
  tokenController.createOtpToken(req, res, next)
);

router.post('/validatetoken', (req, res, next) =>
  tokenController.tokenValidation(req, res, next)
);

router.post('/validateotp', (req, res, next) =>
  tokenController.otpValidation(req, res, next)
);

router.post('/status/list', (req, res, next) =>
  tokenController.listTokenStatus(req, res, next)
);

router.post('/statusbyname', (req, res, next) =>
  tokenController.getTokenStatusByName(req, res, next)
);

export default router;
