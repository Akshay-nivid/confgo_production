import { Router } from 'express';
import { EventController } from '../controllers/EventController';
import { verifyToken } from '../middleware/jwtMiddleware';
import { EventPriceTierController } from '../controllers/EventPriceTierController';
import { EventParticipantEntryController } from '../controllers/EventParticipantEntryController';
import { EventNearbyAttractionController } from '../controllers/EventNearbyAttractionController';

const router = Router();
const eventPriceTierController = new EventPriceTierController();
const eventController = new EventController();
const eventParticipantEntryController = new EventParticipantEntryController();
const eventnearbyAttractionController = new EventNearbyAttractionController();

router.post('/', verifyToken, (req, res, next) =>
  eventController.createEvent(req, res, next)
);

router.post('/status/list', (req, res, next) =>
  eventController.listEventStatus(req, res, next)
);

router.post('/list', verifyToken, (req, res, next) =>
  eventController.listEvent(req, res, next)
);

router.post('/form', verifyToken, (req, res, next) =>
  eventController.removeAndCreateEventRegistrationForm(req, res, next)
);
router.get("/meta/:meetingId", (req, res, next) => eventController.getMeetingMetaData(req, res, next));
router.get('/form/:eventId', verifyToken, (req, res, next) =>
  eventController.getEventRegistrationForms(req, res, next)
);
router.post('/form/update', verifyToken, (req, res, next) =>
  eventController.removeAndCreateEventRegistrationForm(req, res, next)
);

router.post('/slug', (req, res, next) =>
  eventController.updateSlugname(req, res, next)
);

router.post('/publish', verifyToken, (req, res, next) =>
  eventController.publishEvent(req, res, next)
);
router.post('/unpublish', verifyToken, (req, res, next) =>
  eventController.unpublishEvent(req, res, next)
);
router.post('/slug/isAvailable', (req, res, next) =>
  eventController.checkSlugNameAvailability(req, res, next)
);
router.post('/slug/generate', (req, res, next) =>
  eventController.genaerateEventSlugName(req, res, next)
);
router.get('/slug/:slugName', (req, res, next) =>
  eventController.getEventDetailBySlugName(req, res, next)
);

router.put('/update/:id', verifyToken, (req, res, next) =>
  eventController.updateEventDetails(req, res, next)
);
router.get('/:id', (req, res, next) =>
  eventController.getEventDetailById(req, res, next)
);
router.post('/participantEntry', verifyToken, (req, res, next) =>
  eventParticipantEntryController.addEventParticipantEntry(req, res, next)
);
router.post('/participantEntry/update/:id', verifyToken, (req, res, next) =>
  eventParticipantEntryController.updateParticipantEntry(req, res, next)
);
router.get('/participantEntry/list', (req, res, next) =>
  eventParticipantEntryController.listEventParticipantEntry(req, res, next)
);
router.post('/program/add', verifyToken, (req, res, next) =>
  eventController.addProgram(req, res, next)
);
router.post('/addon/add', verifyToken, (req, res, next) =>
  eventController.addSingleAddon(req, res, next)
);
router.post('/attraction', verifyToken, (req, res, next) =>
  eventnearbyAttractionController.createNearbyAttraction(req, res, next)
);
router.put('/attraction/:id', verifyToken, (req, res, next) =>
  eventnearbyAttractionController.updateNearbyAttraction(req, res, next)
);
router.post('/attraction/list', verifyToken, (req, res, next) =>
  eventnearbyAttractionController.getListEventNearbyAttraction(req, res, next)
);
router.post('/priceTier', verifyToken, (req, res, next) =>
  eventPriceTierController.createPriceTier(req, res, next)
);
router.put('/priceTier/update/:eventId', verifyToken, (req, res, next) =>
  eventPriceTierController.removeAndCreatePriceTier(req, res, next)
);
router.put('/priceTier/:id', verifyToken, (req, res, next) =>
  eventPriceTierController.updatePriceTier(req, res, next)
);
router.post('/priceTier/list', verifyToken, (req, res, next) =>
  eventPriceTierController.priceTierList(req, res, next)
);
router.put('/addon/:id', verifyToken, (req, res, next) =>
  eventController.updateAddon(req, res, next)
);
router.put('/template/:eventId', verifyToken, (req, res, next) =>
  eventController.updateTemplate(req, res, next)
);
router.put('/deleteAddon/:id', verifyToken, (req, res, next) =>
  eventController.deleteEventAddon(req, res, next)
);
router.put('/deleteProgram/:id', verifyToken, (req, res, next) =>
  eventController.deleteEventProgram(req, res, next)
);
router.post('/registered/eventList', verifyToken, (req, res, next) =>
  eventController.getRegisteredEventStatus(req, res, next)
);
router.post('/eventList', verifyToken,(req, res, next) =>
  eventController.allCreatedEvents(req, res, next)
);
export default router;
