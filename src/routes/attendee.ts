import express from 'express';
import { AttendeeController } from '../controllers/AttendeeController';
import { verifyToken } from '../middleware/jwtMiddleware';

const attendeeController = new AttendeeController();
const router = express.Router();

router.post('/', verifyToken, (req, res, next) =>
  attendeeController.addAttendee(req, res, next)
);

export default router;
