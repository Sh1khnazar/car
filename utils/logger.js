const { createLogger, format, transports } = require('winston')
const { MongoDBTransportClass } = require('./mongo-transport')

const logger = createLogger({
	level: 'info',
	format: format.combine(
		format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
		format.json(),
	),
	transports: [
		new transports.Console(),
		new transports.File({ filename: 'logs/error.log', level: 'error' }),
		new transports.File({ filename: 'logs/combined.log' }),
		new MongoDBTransportClass(),
	],
})

module.exports = logger
