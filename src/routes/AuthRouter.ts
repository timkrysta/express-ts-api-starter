import express from 'express';
import AuthController from '../controllers/AuthController';
import { AuthValidationRules } from '../config/ValidationRules';
import ValidateMiddleware from '../middlewares/ValidateMiddleware';

const router = express.Router();

router.post('/register', AuthValidationRules.register(), ValidateMiddleware, AuthController.register);
router.post('/login', AuthValidationRules.login(), ValidateMiddleware, AuthController.login);

export default router;
