import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js'
import transporter from '../config/nodemailer.js'
import cloudinary from '../config/cloudinary.js'

export const register = async (req, res) => {
    try {
        const {name, email, password} = req.body
        if (!name || !email || !password) {
            return res.json({success: false, message: 'Missing details'})
        }

        const existingUser = await userModel.findOne({email})
        if (existingUser) {
            return res.json({success: false, message: 'User already exists'})
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = new userModel({name, email, password: hashedPassword})
        await user.save()

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1d'})
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 1 * 24 * 60 * 60 * 1000
        })

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to ChatApp',
            text: `Welcome ${name} to ChatApp. Your account has been created successfully.`
        }
        await transporter.sendMail(mailOptions)

        return res.json({success: true, message: 'User registered successfully'})
    }
    catch (error) {
        return res.json({success: false, message: error.message})
    }
}

export const login = async (req, res) => {
    try {
        const {email, password} = req.body
        if (!email || !password) {
            return res.json({success: false, message: 'Missing details'})
        }

        const user = await userModel.findOne({email})
        if (!user) {
            return res.json({success: false, message: 'User does not exist'})
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.json({success: false, message: 'Invalid credentials'})
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1d'})
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 1 * 24 * 60 * 60 * 1000
        })

        return res.json({success: true, message: 'User logged in successfully'})
    }
    catch (error) {
        return res.json({success: false, message: error.message})
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        })

        return res.json({success: true, message: 'User logged out successfully'})
    }
    catch (error) {
        return res.json({success: false, message: error.message})
    }
}

export const isAuth = async (req, res) => {
    try {
        return res.json({success: true, message: 'User is authenticated'})
    }
    catch (error) {
        return res.json({success: false, message: error.message})
    }    
}

export const getUserData = async (req, res) => {
    try {
        const userId = req.user.id

        const user = await userModel.findById(userId)
        if (!user) {
            return res.json({success: false, message: 'User does not exist'})
        }

        return res.json({
            success: true, message: 'User data fecthed successfully',
            userData: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })
    }
    catch (error) {
        return res.json({success: false, message: error.message})
    }
}

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id
        const {profilePic, bio, name} = req.body

        const user = await userModel.findById(userId)
        if (!user) {
            return res.json({success: false, message: 'User does not exist'})
        }

        let updatedUser
        if (!profilePic) {
            updatedUser = await userModel.findByIdAndUpdate(
                userId,
                {
                    $set: {
                        bio, name
                    }
                },
                {new: true, runValidators: true}
            )
        }
        else {
            const uploadedPic = await cloudinary.uploader.upload(profilePic)
            updatedUser = await userModel.findByIdAndUpdate(
                userId,
                {
                    $set: {
                        profilePic: uploadedPic.secure_url, bio, name
                    }
                },
                {new: true, runValidators: true}
            )
        }

        return res.json({success: true, message: 'Profile updated successfully', user: updatedUser})
    }
    catch (error) {
        return res.json({success: false, message: error.message})
    }
}