const { Schema, model } = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new Schema(
	{
		username: {
			type: String,
			required: [true, 'Foydalanuvchi nomi shart'],
			unique: true,
			trim: true,
		},
		email: {
			type: String,
			required: [true, 'Email kiritish shart'],
			unique: true,
			lowercase: true,
		},
		password: {
			type: String,
			required: [true, 'Parol kiritish shart'],
			minlength: 6,
			select: false,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		refreshToken: {
			type: String,
			select: false,
		},
		otp: {
			code: String,
			expiresAt: Date,
		},
		firstName: {
			type: String,
			trim: true,
			default: '',
		},
		lastName: { type: String, trim: true, default: '' },
		phone: { type: String, trim: true, default: '' },
		avatar: { type: String, default: 'default-avatar.png' },
	},
	{ timestamps: true },
)

// Password hash
userSchema.pre('save', async function () {
	if (!this.isModified('password')) return
	this.password = await bcrypt.hash(this.password, 12)
})

// Correct password method
userSchema.methods.correctPassword = async function (
	candidatePassword,
	userPassword,
) {
	return await bcrypt.compare(candidatePassword, userPassword)
}

module.exports = model('User', userSchema)
