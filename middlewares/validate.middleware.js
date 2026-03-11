const fs = require('fs')

exports.validate = schema => {
	return (req, res, next) => {
		const { error, value } = schema.validate(req.body, {
			abortEarly: false,
			allowUnknown: true,
			stripUnknown: true,
		})

		if (error) {
			// Yuklangan rasmlarni o'chirish
			if (req.files) {
				Object.values(req.files).forEach(files => {
					files.forEach(file => {
						if (fs.existsSync(file.path)) {
							fs.unlinkSync(file.path)
						}
					})
				})
			}
			if (req.file && fs.existsSync(req.file.path)) {
				fs.unlinkSync(req.file.path)
			}

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
