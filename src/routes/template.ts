import { Router } from 'express';
import { TemplateController } from '../controllers/TemplateController';

const router = Router();
const templateController = new TemplateController();

router.post('/list', (req, res, next) =>
  templateController.getAllTemplates(req, res, next)
);
router.get('/:id', (req, res, next) =>
  templateController.getTemplateById(req, res, next)
);
router.post('/colors', (req, res, next) =>
  templateController.getAllTemplateColors(req, res, next)
);

export default router;
