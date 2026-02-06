import { Router } from 'express';
import { ParticipantController } from '../controllers/ParticipantController';
import { ParticipantTypeController } from '../controllers/ParticipantTypeController';
import { verifyToken } from '../middleware/jwtMiddleware';

const router = Router();
const participantController = new ParticipantController();
const participantTypeController = new ParticipantTypeController();

router.post('/', verifyToken, (req, res, next) =>
  participantController.createParticipant(req, res, next)
);

router.post('/type', verifyToken, (req, res, next) => {
  participantTypeController.createParticipantType(req, res, next);
});

router.delete('/type/:id', verifyToken, (req, res, next) => {
  participantTypeController.deleteParticipantType(req, res, next);
});

router.post('/type/update', verifyToken, (req, res, next) => {
  participantTypeController.updateParticipantType(req, res, next);
});

router.post('/group', verifyToken, (req, res, next) => {
  participantController.createParticipantGroup(req, res, next);
});
router.post('/role', verifyToken, (req, res, next) => {
  participantController.createParticipantRole(req, res, next);
});
router.post('/type/list', (req, res, next) =>
  participantTypeController.participantTypeList(req, res, next)
);

router.post('/list', (req, res, next) => {
  participantController.getParticipantList(req, res, next);
});
router.get('/:id', (req, res, next) => {
  participantController.getParticipantDetailsById(req, res, next);
});
router.post('/existing', verifyToken, (req, res, next) => {
  participantController.existingParticipantOrNot(req, res, next);
});
router.post('/payment/details', verifyToken, (req, res, next) => {
  participantController.getParticipantAndPaymentDetailsByEventId(
    req,
    res,
    next
  );
});
router.get('/registered/events', verifyToken, (req, res, next) => {
  participantController.getRegisteredEventsAndPrograms(req, res, next);
});
router.get('/registered/programs/:id', verifyToken, (req, res, next) => {
  participantController.getRegisteredEventsAndPrograms(req, res, next);
});
router.post('/details/qr', verifyToken ,(req, res, next) => {
  participantController.getParticipantDetailsByQr(req, res, next);
});
export default router;
