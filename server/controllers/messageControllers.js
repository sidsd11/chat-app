import cloudinary from '../config/cloudinary.js'
import messageModel from '../models/messageModel.js'
import userModel from '../models/userModel.js'

export const getAllUsers = async (req, res) => {
    try {
        const userId = req.user._id

        const filteredUsers = await userModel.find({_id: {$ne: userId}}).select('-password')
        const unseenMessages = {}
        const promises = users.map(async (user) => {
            const messages = await messageModel.find({senderId: user._id, receiverId: userId, seen: false})
            if (messages.length > 0) {
                unseenMessages[user._id] = messages.length
            }
        })
        await Promise.all(promises)
        res.json({success: true, message: 'Data fetched successfully', users: filteredUsers, unseenMessages})
    }
    catch (error) {
        return res.json({success: false, message: error.message})
    }
}

export const getMessages = async (req, res) => {
    try {
        const userId = req.user._id
        const selectedUserId = req.params.id

        const messages = await messageModel.find({
            $or: [
                {senderId: userId, receiverId: selectedUserId},
                {senderId: selectedUserId, receiverId: userId}
            ]
        })

        await messageModel.updateMany({senderId: selectedUserId, receiverId: userId}, {seen: true})

        return res.json({success: true, message: 'Messages fetched successfully', messages})
    }
    catch (error) {
        return res.json({success: false, message: error.message})
    }
}

export const markMessageAsSeen = async (req, res) => {
    try {
        const id = req.params.id
        await messageModel.findByIdAndUpdate(id, {seen: true})
        return res.json({success: true, message: 'Message marked as seen'})
    }
    catch (error) {
        return res.json({success: false, message: error.message})
    }
}

export const sendMessage = async (req, res) => {
    try {
        const userId = req.user._id
        const receiverId = req.params.id
        const {text, image} = req.body

        let imageUrl
        if (image) {
            const uploadedPic = await cloudinary.uploader.upload(image)
            imageUrl = uploadedPic.secure_url
        }

        const message = new messageModel({senderId: userId, ReceiverId: receiverId, text, image: imageUrl})
        await message.save()

        return res.json({success: true, message: 'Message sent successfully', message})
    }
    catch (error) {
        return res.json({success: false, message: error.message})
    }
}