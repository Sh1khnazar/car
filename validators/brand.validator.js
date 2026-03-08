const Joi = require('joi')

const brandSchema = {
	create: Joi.object({
		name: Joi.string().min(2).max(30).required().messages({
			'string.empty': "Brend nomi bo'sh bo'lishi mumkin emas",
			'string.min': "Brend nomi kamida 2 ta harfdan iborat bo'lishi kerak",
			'any.required': 'Brend nomi majburiy maydon',
		}),
		image: Joi.string().optional(),
	}),
}

module.exports = brandSchema
