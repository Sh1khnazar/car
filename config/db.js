const mongoose = require('mongoose')

async function connectToDB() {
	try {
		await mongoose.connect(process.env.MONGO_URL)
		console.log('Successfully connected to the database')
	} catch (error) {
		console.log('Database connection error:', error.message)
	}
}

module.exports = connectToDB
