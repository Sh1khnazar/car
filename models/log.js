const { Schema, model } = require('mongoose')

const logSchema = new Schema(
	{
		level: {
			type: String,
			enum: ['info', 'error', 'warn'],
			required: true,
		},
		message: { type: String, required: true },
		method: { type: String },
		url: { type: String },
		status: { type: Number },
		body: { type: Schema.Types.Mixed },
		stack: { type: String },
	},
	{ timestamps: true },
)

module.exports = model('Log', logSchema)
