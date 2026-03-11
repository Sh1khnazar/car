const Transport = require('winston-transport')

class MongoDBTransportClass extends Transport {
	constructor(opts) {
		super(opts)
	}

	async log(info, callback) {
		try {
			const Log = require('../models/log')
			await Log.create({
				level: info.level,
				message: info.message,
				method: info.method,
				url: info.url,
				status: info.status,
				body: info.body,
				stack: info.stack,
			})
		} catch (err) {
			console.error('Log saqlashda xato:', err.message)
		}
		callback()
	}
}

module.exports = { MongoDBTransportClass }
