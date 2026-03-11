const User = require('../models/user')
const { generateTokens } = require('../utils/token')
const CustomErrorHandler = require('../utils/custom-error.handler')
const jwt = require('jsonwebtoken')
const sendEmail = require('../utils/send-email')

// 1. Register
const register = async (req, res, next) => {
	try {
		const { username, email, password } = req.body
		const existingUser = await User.findOne({ email })
		if (existingUser)
			throw CustomErrorHandler.BadRequest('Email already exists')

		const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
		const otpExpires = new Date(Date.now() + 5 * 60 * 1000)

		const user = await User.create({
			username,
			email,
			password,
			otp: { code: otpCode, expiresAt: otpExpires },
		})

		await sendEmail({
			email: user.email,
			subject: 'Devbook OTP',
			message: `Sizning OTP kodingiz: ${otpCode}. Kod 5 daqiqa ichida amal qiladi.`,
		})

		res.status(201).json({ success: true, message: 'OTP sent' })
	} catch (error) {
		next(error)
	}
}

// 2. Verify
const verify = async (req, res, next) => {
	try {
		const { email, code } = req.body
		const user = await User.findOne({ email })

		if (!user) throw CustomErrorHandler.BadRequest('User not found')
		if (!user.otp || user.otp.code !== code)
			throw CustomErrorHandler.UnAuthorized('Wrong code')
		if (user.otp.expiresAt < Date.now())
			throw CustomErrorHandler.UnAuthorized('Expired')

		user.isVerified = true
		user.otp = undefined

		const { accessToken, refreshToken } = generateTokens({ id: user._id })
		user.refreshToken = refreshToken
		await user.save()

		res.cookie('refresh_token', refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 7 * 24 * 60 * 60 * 1000,
		})

		res
			.status(200)
			.json({ success: true, accessToken, message: 'Verified and Logged in' })
	} catch (error) {
		next(error)
	}
}

// 3. Login
const login = async (req, res, next) => {
	try {
		const { email, password } = req.body
		const user = await User.findOne({ email }).select('+password')

		if (!user) throw CustomErrorHandler.UnAuthorized('Invalid credentials')
		const isMatch = await user.correctPassword(password, user.password)
		if (!isMatch) throw CustomErrorHandler.UnAuthorized('Invalid credentials')
		if (!user.isVerified) throw CustomErrorHandler.Forbidden('Not verified')

		const { accessToken, refreshToken } = generateTokens({ id: user._id })
		user.refreshToken = refreshToken
		await user.save()

		res.cookie('refresh_token', refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 7 * 24 * 60 * 60 * 1000,
		})

		res.status(200).json({ success: true, accessToken })
	} catch (error) {
		next(error)
	}
}

// 4. Refresh Token
const refreshTokenController = async (req, res, next) => {
	try {
		const { refresh_token } = req.cookies
		if (!refresh_token) throw CustomErrorHandler.BadRequest('Token required')

		let decoded
		try {
			decoded = jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET)
		} catch (err) {
			throw CustomErrorHandler.UnAuthorized('Invalid refresh token')
		}

		const user = await User.findById(decoded.id).select('+refreshToken')
		if (!user || user.refreshToken !== refresh_token) {
			throw CustomErrorHandler.UnAuthorized('Invalid token')
		}

		const tokens = generateTokens({ id: user._id })
		user.refreshToken = tokens.refreshToken
		await user.save()

		res.cookie('refresh_token', tokens.refreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			maxAge: 7 * 24 * 60 * 60 * 1000,
		})

		res.status(200).json({ success: true, accessToken: tokens.accessToken })
	} catch (error) {
		next(error)
	}
}

// 5. Logout
const logout = async (req, res, next) => {
	try {
		const { refresh_token } = req.cookies

		if (refresh_token) {
			await User.findOneAndUpdate(
				{ refreshToken: refresh_token },
				{ refreshToken: null },
			)
		}

		res.clearCookie('refresh_token', {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
		})

		res.status(200).json({ success: true, message: 'Logged out' })
	} catch (error) {
		next(error)
	}
}

// 6. Get Current User
const getMe = async (req, res, next) => {
	try {
		const Brand = require('../models/brand')
		const Car = require('../models/car')

		const user = await User.findById(req.user.id)
		if (!user) throw CustomErrorHandler.NotFound('Foydalanuvchi topilmadi')

		if (user.isAdmin) {
			const [brands, cars] = await Promise.all([
				Brand.find(),
				Car.find({ addedBy: req.user.id }),
			])

			return res.status(200).json({
				success: true,
				data: {
					user,
					brands,
					cars,
				},
			})
		}

		res.status(200).json({ success: true, data: { user } })
	} catch (error) {
		next(error)
	}
}

// 7. Update Profile
const updateMe = async (req, res, next) => {
	try {
		const { firstName, lastName, phone, email, username } = req.body

		if (email || username) {
			const existing = await User.findOne({
				$or: [{ email }, { username }],
				_id: { $ne: req.user.id },
			})
			if (existing)
				throw CustomErrorHandler.BadRequest('Email yoki Username band')
		}

		const updatedUser = await User.findByIdAndUpdate(
			req.user.id,
			{ firstName, lastName, phone, email, username },
			{ new: true, runValidators: true },
		)

		res.status(200).json({
			success: true,
			message: 'Profil muvaffaqiyatli yangilandi',
			data: updatedUser,
		})
	} catch (error) {
		next(error)
	}
}

// 8. Forgot Password
const forgotPassword = async (req, res, next) => {
	try {
		const { email } = req.body

		const user = await User.findOne({ email })
		if (!user) throw CustomErrorHandler.NotFound('Foydalanuvchi topilmadi')

		const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
		const otpExpires = new Date(Date.now() + 5 * 60 * 1000)

		user.otp = { code: otpCode, expiresAt: otpExpires }
		await user.save()

		await sendEmail({
			email: user.email,
			subject: 'Parolni tiklash',
			message: `Parolni tiklash uchun OTP kodingiz: ${otpCode}. Kod 5 daqiqa ichida amal qiladi.`,
		})

		res
			.status(200)
			.json({ success: true, message: 'OTP kod emailga yuborildi' })
	} catch (error) {
		next(error)
	}
}

// 9. Reset Password
const resetPassword = async (req, res, next) => {
	try {
		const { email, code, newPassword } = req.body

		const user = await User.findOne({ email })
		if (!user) throw CustomErrorHandler.NotFound('Foydalanuvchi topilmadi')

		if (!user.otp || user.otp.code !== code)
			throw CustomErrorHandler.BadRequest("OTP kod noto'g'ri")
		if (user.otp.expiresAt < Date.now())
			throw CustomErrorHandler.BadRequest('OTP kod muddati tugagan')

		user.password = newPassword
		user.otp = undefined
		await user.save()

		res
			.status(200)
			.json({ success: true, message: 'Parol muvaffaqiyatli yangilandi' })
	} catch (error) {
		next(error)
	}
}

// 10. Change Password
const changePassword = async (req, res, next) => {
	try {
		const { oldPassword, newPassword } = req.body

		const user = await User.findById(req.user.id).select('+password')
		if (!user) throw CustomErrorHandler.NotFound('Foydalanuvchi topilmadi')

		const isMatch = await user.correctPassword(oldPassword, user.password)
		if (!isMatch) throw CustomErrorHandler.BadRequest("Eski parol noto'g'ri")

		user.password = newPassword
		await user.save()

		res
			.status(200)
			.json({ success: true, message: 'Parol muvaffaqiyatli yangilandi' })
	} catch (error) {
		next(error)
	}
}

module.exports = {
	register,
	verify,
	login,
	refreshToken: refreshTokenController,
	logout,
	getMe,
	updateMe,
	forgotPassword,
	resetPassword,
	changePassword,
}
