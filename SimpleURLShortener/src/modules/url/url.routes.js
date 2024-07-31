import { Router } from 'express';
import * as urlController from './controller/url.controller.js';
const router = Router();
router.post('/shorten', urlController.originalUrl)
.get('/:shortUrl',urlController.getShortId)


export default router;
