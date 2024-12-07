import express from 'express';
import { authenticate, restrict } from "../auth/verifyToken.js"
import { getChatList, getMessages, uploadFile } from '../Controllers/chatController.js';

const router = express.Router();

router.get('/list', authenticate, getChatList);
router.get('/messages/:doctorId', authenticate, getMessages);
router.post('/upload', authenticate, uploadFile);

export default router;

