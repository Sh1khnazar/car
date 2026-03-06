const express = require('express')
const cors = require('cors')
const connectToDB = require('./config/db')
require('dotenv').config()

const app = express()

const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cors())

// Logger middleware
app.use(require('./middlewares/logger.middleware'))

// Error middleware
app.use(require('./middlewares/error.middleware'))

async function startServer() {
	try {
		await connectToDB()

		app.listen(PORT, () => {
			console.log('Server is running at:', PORT)
		})
	} catch (error) {
		console.error('Failed to start server:', error.message)
		process.exit(1)
	}
}

startServer()
