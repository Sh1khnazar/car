const express = require('express')
const cors = require('cors')
const path = require('path')
const cookieParser = require('cookie-parser')
const connectToDB = require('./config/db')
const authRouter = require('./routes/auth.routes')
const brandRouter = require('./routes/brand.routes')
const carRouter = require('./routes/car.routes')
require('dotenv').config()

const app = express()

const PORT = process.env.PORT || 3000

app.use(cookieParser())
app.use(express.json())
app.use(cors())

// Static files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))

// Logger middleware
app.use(require('./middlewares/logger.middleware'))

app.use('/api/auth', authRouter)
app.use('/api/brands', brandRouter)
app.use('/api/cars', carRouter)

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
