module.exports = class CustomErrorHandler extends Error {
	constructor(statusCode, message, errors = []) {
		super(message)
		this.statusCode = statusCode
		this.errors = errors

		Error.captureStackTrace(this, this.constructor)
	}

	static UnAuthorized(message = 'Avtorizatsiyadan o‘tilmagan', errors = []) {
		return new CustomErrorHandler(401, message, errors)
	}

	static BadRequest(message = 'Bad request', errors = []) {
		return new CustomErrorHandler(400, message, errors)
	}

	static NotFound(message = 'Ma’lumot topilmadi', errors = []) {
		return new CustomErrorHandler(404, message, errors)
	}

	static Forbidden(message = 'Sizga ruxsat berilmagan', errors = []) {
		return new CustomErrorHandler(403, message, errors)
	}

	static InternalServerError(message = 'Server xatoligi', errors = []) {
		return new CustomErrorHandler(500, message, errors)
	}
}
