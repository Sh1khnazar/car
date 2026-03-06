const Joi = require('joi')

const carSchema = Joi.object({
	name: Joi.string()
		.min(2)
		.max(100)
		.required()
		.messages({ 'any.required': 'Mashina nomi kiritilishi shart' }),

	price: Joi.number()
		.positive()
		.required()
		.messages({ 'number.positive': 'Narx musbat son bo‘lishi kerak' }),

	marka: Joi.string()
		.required()
		.messages({ 'any.required': 'Marka (masalan: Chevrolet) majburiy' }),

	tanirovka: Joi.string().valid('Bor', 'Yo`q').required().messages({
		'any.only': 'Tanirovka faqat "Bor" yoki "Yo`q" bo‘lishi mumkin',
	}),

	motor: Joi.string()
		.required()
		.messages({ 'any.required': 'Motor hajmi kiritilishi shart' }),

	year: Joi.number()
		.integer()
		.min(1900)
		.max(2026)
		.required()
		.messages({ 'number.max': 'Yil 2026 dan oshmasligi kerak' }),

	color: Joi.string().required(),

	distance: Joi.string()
		.required()
		.messages({ 'any.required': 'Yurgan masofasi (km) kiritilishi shart' }),

	gearbook: Joi.string()
		.valid('Avtomat karobka', 'Mexanika karobka')
		.required()
		.messages({ 'any.only': 'Karobka turi noto‘g‘ri kiritildi' }),

	description: Joi.string()
		.min(10)
		.max(500)
		.required()
		.messages({ 'string.min': 'Tavsif kamida 10 ta belgidan iborat bo‘lsin' }),

	categoryId: Joi.string()
		.hex()
		.length(24)
		.required()
		.messages({ 'string.length': 'Kategoriya ID si noto‘g‘ri' }),

	images: Joi.object({
		outer: Joi.string().required(),
		inner: Joi.string().required(),
		side: Joi.string().required(),
	}).required(),
})

const validateCar = data => {
	return carSchema.validate(data, { abortEarly: false })
}

module.exports = { validateCar }
