import express from 'express'
import UserController from '../../api/controllers/UserController.js'

let router = express.Router()

router.post('/user',UserController().register);
router.post('/register',UserController().register);
router.post('/login',UserController().login);
router.post('/validate',UserController().validate);

export default router;
