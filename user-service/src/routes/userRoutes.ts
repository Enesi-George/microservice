import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { UserService } from '../services/UserService';
import { UserRepository } from '../repositories/userRepo';

const router = Router();
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.post('/signup', userController.signup);
router.post('/signin', userController.signin);

export default router;