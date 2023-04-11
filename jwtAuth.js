import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const createToken = (user) => {
	let data = {
		_id: user._id,
		email: user.email,
		role: user.role
	}

	return jwt.sign(data, process.env.JWT_SECRET, {expiresIn: '2h'})
}

export const verifyToken = (token) => {
	return jwt.verify(token, process.env.JWT_SECRET)
}