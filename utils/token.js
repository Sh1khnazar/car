const jwt = require('jsonwebtoken')

const generateTokens = payload => {
	const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
		expiresIn: process.env.JWT_ACCESS_TIME || '15m',
	})

	const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
		expiresIn: process.env.JWT_REFRESH_TIME || '7d',
	})

	return { accessToken, refreshToken }
}

module.exports = { generateTokens }
