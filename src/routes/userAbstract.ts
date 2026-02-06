import { Router } from 'express';
import { UserAbstractController } from '../controllers/UserAbstractController';

const router = Router();
const userAbstractController = new UserAbstractController();

router.post('/', (req, res, next) =>
  userAbstractController.addUserAbstract(req, res, next)
);

router.get('/:id', (req, res, next) =>
  userAbstractController.getUserAbstractById(req, res, next)
);

router.put('/:id', (req, res, next) =>
  userAbstractController.updateUserAbstract(req, res, next)
);

router.post('/list', (req, res, next) =>
  userAbstractController.getAbstractList(req, res, next)
);

router.post('/status/list', (req, res, next) =>
  userAbstractController.listUserAbstractStatus(req, res, next)
);

router.post('/assign', (req, res, next) =>
  userAbstractController.assignReviewer(req, res, next)
);
export default router;
