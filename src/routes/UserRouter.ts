import express from 'express';
import UserController from '../controllers/UserController';

const router = express.Router();

router.get('/', UserController.index);
router.get('/:id', UserController.show);
router.put('/:id', UserController.update);
router.delete('/:id', UserController.destroy);

export default router;
