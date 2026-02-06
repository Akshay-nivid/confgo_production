/**
 * Auth Routes
 * Author: sarathavs
 */
import express from 'express';
import { DataController } from '../controllers/DataController';

const dataController = new DataController();
const router = express.Router();

// POST /auth - Authenticate and get token
router.post('/', (req, res, next) => dataController.getData(req, res, next));

export default router;
