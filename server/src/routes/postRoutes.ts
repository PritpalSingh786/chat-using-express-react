// src/routes/userRoutes.ts
import { Router } from 'express';
import { createPost } from '../controllers/postController';

import { authenticateJWT } from '../middleware/jwtAuthMiddleware';

const router = Router();

router.post('/createPost', authenticateJWT, createPost);


export default router;
