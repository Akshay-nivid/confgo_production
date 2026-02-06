/**
 * @author saneeshiv
 */
import { Router } from 'express';
import { CompanyController } from '../controllers/CompanyController';
import { verifyToken } from '../middleware/jwtMiddleware';

const router = Router();
const companyController = new CompanyController();

router.post('/', (req, res, next) =>
  companyController.createCompany(req, res, next)
);
router.post('/status/list', (req, res, next) =>
  companyController.getAllCompanyStatus(req, res, next)
);
router.put('/:id', (req, res, next) =>
  companyController.updateCompany(req, res, next)
);
router.get('/', verifyToken, (req, res, next) =>
  companyController.getCompanyDetailsByUserId(req, res, next)
);

export default router;
