import { Router } from 'express';

import { getHealth } from './health.controller';

const router = Router();

/** GET /health */
router.get('/', getHealth);

export default router;
