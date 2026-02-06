import { Router } from 'express';
import { EventSpeakerController } from '../controllers/EventSpeakerController';
import { verifyToken } from '../middleware/jwtMiddleware';


const router = Router();
const eventSpeakerController = new EventSpeakerController();

router.post('/create', (req, res, next) =>
  eventSpeakerController.createEventSpeaker(req, res, next)
);

router.post('/list', (req, res, next) =>
  eventSpeakerController.getAllEventPrograms(req, res, next)
);

router.post('/status/list', (req, res, next) =>
  eventSpeakerController.listEventProgramStatus(req, res, next)
);

router.post('/status/byname', (req, res, next) =>
  eventSpeakerController.getEventProgramStatusByName(req, res, next)
);

router.get('/:id', (req, res, next) =>
  eventSpeakerController.getEventProgramById(req, res, next)
);

router.put('/:id', (req, res, next) =>
  eventSpeakerController.updateEventSpeaker(req, res, next)
);
router.post('/delete/:id', (req, res, next) =>
  eventSpeakerController.deleteProgramSchedule(req, res, next)
);
router.post('/speaker-bio',verifyToken, (req, res, next) =>
  eventSpeakerController.createEventSpeakerBio(req, res, next)
);
router.put('/speaker-bio/:id',verifyToken, (req, res, next) =>
  eventSpeakerController.updateEventSpeakerBio(req, res, next)
);
router.post('/assigned/events', verifyToken, (req, res, next) =>
  eventSpeakerController.speakerAssignedEventsList(req, res, next)
);
router.post('/details/list', (req, res, next) =>
  eventSpeakerController.speakerDetailsList(req, res, next)
);


export default router;
