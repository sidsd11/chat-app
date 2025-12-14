import express from 'express'

import userAuth from '../middlewares/authUser.js'
import { getAllUsers, getAllMessages, markMessageAsSeen, sendMessage } from '../controllers/messageControllers.js'

const messageRouter = express.Router()

messageRouter.get('/get-all-users', userAuth, getAllUsers)
messageRouter.get('/get-all-messages/:id', userAuth, getAllMessages)
messageRouter.patch('/mark-as-seen/:id', userAuth, markMessageAsSeen)
messageRouter.post('/send-message/:id', userAuth, sendMessage)

export default messageRouter