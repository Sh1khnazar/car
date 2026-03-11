const { Schema, model } = require('mongoose')

const carSchema = new Schema(
	{
		brand: { type: String, required: true, trim: true },
		modelName: { type: String, required: true, trim: true },
		price: { type: Number, required: true },
		year: { type: Number, required: true },
		motor: { type: String, required: true },
		color: { type: String, required: true },
		distance: { type: String, default: '0 km' },
		gearbook: {
			type: String,
			enum: ['Avtomat karobka', 'Mexanik karobka'],
			required: true,
		},
		tanirovka: { type: String, enum: ['Bor', "Yo'q"], default: "Yo'q" },
		description: { type: String, trim: true },

		outerImage: { type: String, required: true },
		innerImage: { type: String, required: true },
		sideImage: { type: String, required: true },

		addedBy: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{ timestamps: true },
)

module.exports = model('Car', carSchema)
