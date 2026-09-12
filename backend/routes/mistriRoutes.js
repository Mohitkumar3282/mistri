import express from 'express';
import { getMistris, getMistriById } from '../controllers/mistriController.js';

const router = express.Router();

router.get('/', getMistris);
router.get('/:id', getMistriById);

export default router;
