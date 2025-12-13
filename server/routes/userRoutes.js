import express from 'express'
import userAuth from '../middlewares/authUser.js'
import { getUserData, isAuth, login, logout, register, updateProfile } from '../controllers/userControllers.js'

const userRouter = express.Router()

userRouter.post('/register', register)
userRouter.post('/login', login)
userRouter.post('/logout', logout)
userRouter.get('/is-auth', userAuth, isAuth)
userRouter.get('/get-user-data', userAuth, getUserData)
userRouter.put('/update-profile', userAuth, updateProfile)

export default userRouter