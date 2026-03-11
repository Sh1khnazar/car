const Joi = require('joi')

const carSchema = Joi.object({
	brand: Joi.string()
		.required()
		.messages({ 'any.required': 'Marka (masalan: Chevrolet) majburiy' }),

	modelName: Joi.string()
		.min(2)
		.max(100)
		.required()
		.messages({ 'any.required': 'Mashina nomi kiritilishi shart' }),

	price: Joi.number()
		.positive()
		.required()
		.messages({ 'number.positive': 'Narx musbat son bolishi kerak' }),

	tanirovka: Joi.string()
		.valid('Bor', `Yo'q`)
		.required()
		.messages({
			'any.only': `Tanirovka faqat "Bor" yoki "Yo'q" bolishi mumkin`,
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
		.valid('Avtomat karobka', 'Mexanik karobka')
		.required()
		.messages({ 'any.only': `Karobka turi noto'g'ri kiritildi` }),

	description: Joi.string()
		.min(10)
		.max(500)
		.required()
		.messages({ 'string.min': 'Tavsif kamida 10 ta belgidan iborat bolsin' }),
})

module.exports = { carSchema }
