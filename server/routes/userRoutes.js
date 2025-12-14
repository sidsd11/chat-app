import express from 'express'

import userAuth from '../middlewares/authUser.js'
import { editProfile, getSingleUserData, getUserData, isAuth, login, logout, register } from '../controllers/userControllers.js'

const userRouter = express.Router()

userRouter.post('/register', register)
userRouter.post('/login', login)
userRouter.post('/logout', logout)
userRouter.get('/is-auth', userAuth, isAuth)
userRouter.get('/get-user-data', userAuth, getUserData)
userRouter.get('/get-single-user-data/:id', userAuth, getSingleUserData)
userRouter.patch('/edit-profile', userAuth, editProfile)
export default userRouter