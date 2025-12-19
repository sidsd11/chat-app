import cloudinary from '../config/cloudinary.js'
import messageModel from '../models/messageModel.js'
import userModel from '../models/userModel.js'

export const getAllUsers = async (req, res) => {
    try {
        const userId = req.user.id

        const filteredUsers = await userModel.find({_id: {$ne: userId}}).select('_id name profilePic bio')
        const unseenMessages = {}
        const promises = filteredUsers.map(async (user) => {
            const messages = await messageModel.find({senderId: user._id, receiverId: userId, seen: false})
            if (messages.length > 0) {
                unseenMessages[user._id] = messages.length
            }
        })
        await Promise.all(promises)

        return res.json({success: true, message: 'Data fetched successfully', allUsersList: filteredUsers, unseenMessages})
    }
    catch (error) {
        return res.json({success: false, message: error.message})
    }
}

export const getAllMessages = async (req, res) => {
    try {
        const userId = req.user.id
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
        const senderId = req.params.id
        const receiverId = req.user.id
        await messageModel.findByIdAndUpdate(
            {senderId, receiverId, seen: false},
            {
                $set: {
                    seen: true
                }
            }
        )
        return res.json({success: true, message: 'Message marked as seen'})
    }
    catch (error) {
        return res.json({success: false, message: error.message})
    }
}

export const sendMessage = async (req, res) => {
    try {
        const userId = req.user.id
        const receiverId = req.params.id
        const {text, image} = req.body

        let imageUrl
        if (image) {
            const uploadedPic = await cloudinary.uploader.upload(image)
            imageUrl = uploadedPic.secure_url
        }

        const message = new messageModel({senderId: userId, receiverId: receiverId, text, image: imageUrl})
        await message.save()

        return res.json({success: true, message: 'Message sent successfully', message})
    }
    catch (error) {
        return res.json({success: false, message: error.message})
    }
}