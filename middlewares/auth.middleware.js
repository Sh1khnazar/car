const CustomErrorHandler = require('../utils/custom-error.handler')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

exports.protect = async (req, res, next) => {
	try {
		const authHeader = req.headers.authorization

		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return next(CustomErrorHandler.UnAuthorized('Token topilmadi'))
		}

		const token = authHeader.split(' ')[1]

		if (!token) {
			return next(CustomErrorHandler.UnAuthorized('Token mavjud emas'))
		}

		const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET)

		const user = await User.findById(decoded.id)
		if (!user) {
			return next(CustomErrorHandler.UnAuthorized('Foydalanuvchi topilmadi'))
		}

		req.user = user
		next()
	} catch (error) {
		console.error('JWT Error:', error.message)
		return next(
			CustomErrorHandler.UnAuthorized("Yaroqsiz yoki muddati o'tgan token"),
		)
	}
}

exports.isAdmin = (req, res, next) => {
	if (!req.user || !req.user.isAdmin) {
		return next(CustomErrorHandler.Forbidden(`Sizga ruxsat berilmagan!`))
	}

	next()
}
