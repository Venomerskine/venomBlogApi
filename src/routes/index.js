import express from 'express';
import userController from '../controller/userController.js'

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello, World!');
});

router.post('/register', userController.register)

export default router;