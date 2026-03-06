const logger = require('../utils/logger')

module.exports = (req, res, next) => {
	// Request log
	logger.info({
		message: 'Incoming request',
		method: req.method,
		url: req.originalUrl,
		body: req.body,
		params: req.params,
		query: req.query,
	})

	// Response log
	const oldSend = res.send
	res.send = function (data) {
		logger.info({
			message: 'Response sent',
			status: res.statusCode,
			response: data,
		})
		oldSend.apply(res, arguments)
	}

	next()
}

/*Har bir request va response loglanadi. */
