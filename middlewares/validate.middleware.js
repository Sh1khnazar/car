const validate = schema => {
	return (req, res, next) => {
		const { error, value } = schema.validate(req.body, {
			abortEarly: false, // Barcha xatolarni birdaniga ko'rsatish uchun
			allowUnknown: true, // Sxemada yo'q maydonlarga ruxsat berish
			stripUnknown: true, // Sxemada yo'q maydonlarni req.body dan tozalab tashlash
		})

		if (error) {
			const errorMessage = error.details
				.map(detail => detail.message)
				.join(', ')
			return res.status(400).json({
				success: false,
				message: errorMessage,
			})
		}

		req.body = value
		next()
	}
}

module.exports = validate
