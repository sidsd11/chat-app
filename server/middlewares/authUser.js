import jwt from 'jsonwebtoken'

import userModel from '../models/userModel.js'

const userAuth = async (req, res, next) => {
    try {
        const {token} = req.cookies

        if (!token) {
            return res.json({success: false, message: 'Not authorized. Login again'})
        }

        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)
        if (tokenDecode.id) {
            const user = await userModel.findById(tokenDecode.id)
            if (user) {
                req.user = {
                    id: tokenDecode.id
                }
            }
            else {
                return res.json({success: false, message: 'User does not exist. Please login again'})
            }
        }
        else {
            return res.json({success: false, message: 'Not authorized. Login again'})
        }
        next()
    }
    catch (error) {
        return res.json({success: false, message: error.message})
    }
}

export default userAuth