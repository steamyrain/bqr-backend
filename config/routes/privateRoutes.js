import express from 'express'
import UserController from '../../api/controllers/UserController.js'

let router = express.Router()
router.get('/users',UserController().getAll)

export default router;
