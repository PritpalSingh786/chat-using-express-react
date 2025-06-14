// src/routes/userRoutes.ts
import { Router } from 'express';
import { login, logout, signup, getAllUsers } from '../controllers/userController';
import { authenticateJWT } from '../middleware/jwtAuthMiddleware';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

// Protect logout route
router.get('/getAllUsers', authenticateJWT, getAllUsers);


export default router;
