import express from 'express'
import auth from '../middleware/auth.js';
import { updateUserController } from '../controller/user-admcontroller.js';

const router =express.Router()
//??Get user||Get



//?Update user|| Put

router.put('/update-user', auth, updateUserController)

export default router;