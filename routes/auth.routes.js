const { Router } = require('express')
const {
	register,
	login,
	logout,
	refreshToken,
	verify,
	getMe,
	updateMe,
	forgotPassword,
	resetPassword,
	changePassword,
} = require('../controllers/auth.controller')
const { protect } = require('../middlewares/auth.middleware')
const { validate } = require('../middlewares/validate.middleware')
const {
	registerSchema,
	loginSchema,
	verifySchema,
	refreshSchema,
	updateMeSchema,
	forgotPasswordSchema,
	resetPasswordSchema,
	changePasswordSchema,
} = require('../validators/auth.validator')

const authRouter = Router()

authRouter.post('/register', validate(registerSchema), register)
authRouter.post('/login', validate(loginSchema), login)
authRouter.post('/verify', validate(verifySchema), verify)
authRouter.post('/refresh-token', validate(refreshSchema), refreshToken)
authRouter.post('/logout', protect, logout)
authRouter.get('/me', protect, getMe)
authRouter.patch('/me', protect, validate(updateMeSchema), updateMe)
authRouter.post(
	'/forgot-password',
	validate(forgotPasswordSchema),
	forgotPassword,
)
authRouter.post('/reset-password', validate(resetPasswordSchema), resetPassword)
authRouter.patch(
	'/change-password',
	protect,
	validate(changePasswordSchema),
	changePassword,
)

module.exports = authRouter
