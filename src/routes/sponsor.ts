import { Router } from 'express';
import { SposnorController } from '../controllers/SponsorController';
import { verifyToken } from '../middleware/jwtMiddleware';

const router = Router();
const sponsorController = new SposnorController();

router.post('/', verifyToken, (req, res, next) =>
    sponsorController.createSponsor(req, res, next)
);
router.post('/assign', verifyToken, (req, res, next) =>
    sponsorController.assignSponsor(req, res, next)
);
router.post('/update/:id', verifyToken, (req, res, next) =>
    sponsorController.updateSponsor(req, res, next)
);

router.post('/list', verifyToken, (req, res, next) =>
    sponsorController.getAllSponsors(req, res, next)
  );

router.post('/delete/:id', verifyToken, (req, res, next) =>
  sponsorController.deleteSponsor(req, res, next)
);
router.post('/remove/:id', verifyToken, (req, res, next) =>
  sponsorController.removeSponsorFromEvent(req, res, next)
);
export default router;
