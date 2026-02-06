import { Router } from 'express';
import { EventRegistrationRecordController } from '../controllers/EventRegistrationRecordController';
import { verifyToken } from '../middleware/jwtMiddleware';

const router = Router();
const registrationRecordController = new EventRegistrationRecordController();

router.post('/', verifyToken, (req, res, next) =>
  registrationRecordController.createEventRegistrationRecord(req, res, next)
);

router.put('/:id', (req, res, next) =>
  registrationRecordController.updateEventRegistrationRecord(req, res, next)
);
router.post('/list', (req, res, next) =>
  registrationRecordController.getAllRecords(req, res, next)
);
router.put('/participant/:id', verifyToken, (req, res, next) =>
  registrationRecordController.updateEventRegistrationRecordParticipantId(
    req,
    res,
    next
  )
);

export default router;
