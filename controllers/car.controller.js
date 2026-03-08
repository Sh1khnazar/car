const Car = require('../models/car')
const Brand = require('../models/brand')
const CustomErrorHandler = require('../utils/custom-error.handler')

// 1. Markalar ro'yxatini olish (Chevrolet, Lada, Ferrari...)
exports.getAllBrands = async (req, res, next) => {
	try {
		const brands = await Car.aggregate([
			{
				$group: {
					_id: '$brand',
					image: { $first: '$outerImage' },
				},
			},
		])

		res.status(200).json({
			status: 'success',
			data: { brands },
		})
	} catch (error) {
		next(error)
	}
}

// 2. Yangi brend qo'shish (Faqat Admin)
exports.createBrand = async (req, res, next) => {
	try {
		const { name } = req.body
		const image = req.file ? req.file.path : null

		if (!image)
			return next(CustomErrorHandler.BadRequest('Brend logotipini yuklang'))

		const newBrand = await Brand.create({ name, image })
		res.status(201).json({ status: 'success', data: newBrand })
	} catch (error) {
		next(error)
	}
}

// 3. Tanlangan markaga tegishli modellarni olish
exports.getCarsByBrand = async (req, res, next) => {
	try {
		const { brand } = req.params

		const cars = await Car.find({
			brand: { $regex: brand, $options: 'i' },
		}).sort('-createdAt')

		if (!cars || cars.length === 0) {
			return next(
				CustomErrorHandler.NotFound(
					`${brand} brendiga oid moshinalar topilmadi`,
				),
			)
		}

		res.status(200).json({
			status: 'success',
			results: cars.length,
			data: { cars },
		})
	} catch (error) {
		next(error)
	}
}

// 4. Bitta mashinani ID bo'yicha olish (Hammasi uchun ochiq)
exports.getOneCar = async (req, res, next) => {
	try {
		const car = await Car.findById(req.params.id)
		if (!car) {
			return next(CustomErrorHandler.NotFound('Bunday mashina topilmadi'))
		}
		res.status(200).json({
			status: 'success',
			data: { car },
		})
	} catch (error) {
		next(error)
	}
}

// 5. Yangi mashina qo'shish (Faqat Admin)
exports.createCar = async (req, res, next) => {
	try {
		const carData = {
			...req.body,
			outerImage: req.files?.outerImage ? req.files.outerImage[0].path : null,
			innerImage: req.files?.innerImage ? req.files.innerImage[0].path : null,
			sideImage: req.files?.sideImage ? req.files.sideImage[0].path : null,
			addedBy: req.user.id,
		}

		const newCar = await Car.create(carData)
		res.status(201).json({
			status: 'success',
			data: { car: newCar },
		})
	} catch (error) {
		next(error)
	}
}

// 6. Mashinani tahrirlash (Faqat Admin)
exports.updateCar = async (req, res, next) => {
	try {
		const updatedCar = await Car.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		})

		if (!updatedCar) {
			return next(
				CustomErrorHandler.NotFound('O‘zgartirish uchun mashina topilmadi'),
			)
		}

		res.status(200).json({
			status: 'success',
			data: { car: updatedCar },
		})
	} catch (error) {
		next(error)
	}
}

// 7. Mashinani o'chirish (Faqat Admin)
exports.deleteCar = async (req, res, next) => {
	try {
		const car = await Car.findByIdAndDelete(req.params.id)
		if (!car) {
			return next(
				CustomErrorHandler.NotFound('O‘chirish uchun mashina topilmadi'),
			)
		}
		res.status(204).json({
			status: 'success',
			data: null,
		})
	} catch (error) {
		next(error)
	}
}
