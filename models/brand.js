const { Schema, model } = require('mongoose')

const brandSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, 'Brend nomi shart'],
			unique: true,
			trim: true,
			minlength: [2, 'Brend nomi kamida 2 ta harf bo‘lishi kerak'],
			maxlength: [50, 'Brend nomi juda uzun'],
		},

		image: {
			type: String,
			required: [true, 'Brend logotipi (rasmi) shart'],
		},
	},
	{
		timestamps: true,
	},
)

// JSON da __v ni yashirish
brandSchema.set('toJSON', {
	transform: (doc, ret) => {
		delete ret.__v
		return ret
	},
})

module.exports = model('Brand', brandSchema)
