import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import connectDB from './config/connectDB.js'
import userRouter from './routes/userRoutes.js'
import messageRouter from './routes/messageRoutes.js'

const app = express()
const port = process.env.PORT || 5000

await connectDB()

app.use(express.json({limit: '4mb'}))
app.use(cors({origin: true, credentials: true}))
app.use(cookieParser())

app.get('/', (req, res) => {
    res.send('API Working')
})

app.listen(port, (req, res) => {
    console.log(`Server is running on port: ${port}`)
})

app.use('/api/user', userRouter)
app.use('/api/message', messageRouter)