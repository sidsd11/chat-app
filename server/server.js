import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import http from 'http'
import { Server } from 'socket.io'

import connectDB from './config/connectDB.js'
import userRouter from './routes/userRoutes.js'
import messageRouter from './routes/messageRoutes.js'
import messageModel from './models/messageModel.js'

const app = express()
const port = process.env.PORT || 5000

await connectDB()

app.use(express.json({limit: '4mb'}))
app.use(cors({origin: true, credentials: true}))
app.use(cookieParser())

app.get('/', (req, res) => {
    res.send('API Working')
})

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: true,
        credentials: true
    }
})

server.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})

const activeRooms = new Map()

io.on('connection', (socket) => {
    console.log('User connected', socket.id)

    socket.on('join_room', (roomId, userId) => {
        socket.join(roomId)
        socket.userId = userId
        if (!activeRooms.has(roomId)) {
            activeRooms.set(roomId, new Set())
        }
        activeRooms.get(roomId).add(userId)
        console.log(`User ${userId} joined room ${roomId}`)
    })

    socket.on('leave_room', (roomId) => {
        socket.leave(roomId)
        if (activeRooms.has(roomId)) {
            activeRooms.get(roomId).delete(socket.userId)
            if (activeRooms.get(roomId).size === 0) {
                activeRooms.delete(roomId)
            }
        }
    })

    socket.on('send_message', async (data) => {
        socket.to(data.roomId).emit('receive_message', data)

        const usersInRoom = activeRooms.get(data.roomId) || new Set()
        const receiverInRoom = usersInRoom.has(data.receiverId)
        if (receiverInRoom) {
            await messageModel.updateMany(
                {
                    senderId: data.senderId,
                    receiverId: data.receiverId,
                    seen: false
                },
                {
                    $set: {
                        seen: true
                    }
                }
            )
            io.to(data.roomId).emit('message_marked_as_seen')
        }
        else {
            const receiverSocketId = [...io.sockets.sockets.values()].find(s => s.userId === data.receiverId)
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('new_unseen_message', {senderId: data.senderId})
            }
        }

        io.to(data.roomId).emit('refresh_chats')
    })

    socket.on('seen_message', async ({roomId, userId}) => {
        if (!roomId || !userId) return
        await messageModel.updateMany(
            {
                receiverId: userId,
                seen: false
            },
            {
                $set: {
                    seen: true
                }
            }
        )

        socket.to(roomId).emit('message_marked_as_seen')
        io.to(roomId).emit('refresh_chats')
    })

    socket.on('disconnect', () => {
        for (const [roomId, users] of activeRooms.entries()) {
            users.delete(socket.userId)
            if (users.size === 0) {
                activeRooms.delete(roomId)
            }
        }
        console.log('User disconnected:', socket.id)
    })
})

app.use('/api/user', userRouter)
app.use('/api/message', messageRouter)