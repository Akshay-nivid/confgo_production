import express from 'express';
import { VolunteerController } from '../controllers/VolunteerController';
import { verifyToken } from '../middleware/jwtMiddleware';

const volunteerController = new VolunteerController();
const router = express.Router();

router.post('/', (req, res, next) =>
  volunteerController.addVolunteer(req, res, next)
);
router.post('/list', (req, res, next) =>
  volunteerController.getVolunteerList(req, res, next)
);
router.get('/events', verifyToken, (req, res, next) =>
  volunteerController.getVolunteerEvents(req, res, next)
);

export default router;
