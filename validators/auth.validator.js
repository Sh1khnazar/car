const Joi = require('joi')

const registerSchema = Joi.object({
	username: Joi.string().min(3).max(30).required(),
	email: Joi.string().email().required(),
	password: Joi.string().min(6).required(),
})

const loginSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().required(),
})

const verifySchema = Joi.object({
	email: Joi.string().email().required(),
	code: Joi.string().length(6).required(),
})

const refreshSchema = Joi.object({
	token: Joi.string().required(),
})

const updateMeSchema = Joi.object({
	firstName: Joi.string().min(2).max(50).optional(),
	lastName: Joi.string().min(2).max(50).optional(),
	phone: Joi.string()
		.pattern(/^\+998[0-9]{9}$/)
		.messages({
			'string.pattern.base': "Telefon raqami noto'g'ri formatda",
		})
		.optional(),
	email: Joi.string().email().optional(),
	username: Joi.string().min(3).max(30).alphanum().optional(),
}).min(1)

const getMeSchema = Joi.object({})

module.exports = {
	registerSchema,
	loginSchema,
	verifySchema,
	refreshSchema,
	updateMeSchema,
	getMeSchema,
}
