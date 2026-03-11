const Car = require('../models/car')
const fs = require('fs')
const path = require('path')
const CustomErrorHandler = require('../utils/custom-error.handler')

// 1. Brand nomi bo'yicha mashinalarni olish
exports.getCarsByBrand = async (req, res, next) => {
	try {
		const { brandName } = req.params

		const cars = await Car.find({
			brand: { $regex: new RegExp(`^${brandName}$`, 'i') },
		})

		res.status(200).json({
			status: 'success',
			results: cars.length,
			data: cars,
		})
	} catch (error) {
		next(error)
	}
}

// 2. Bitta mashinani olish
exports.getCar = async (req, res, next) => {
	try {
		const { brandName, id } = req.params

		const car = await Car.findById(req.params.id)

		if (!car) {
			return next(CustomErrorHandler.NotFound('Mashina topilmadi'))
		}

		if (car.brand.toLowerCase() !== brandName.toLowerCase()) {
			return next(
				CustomErrorHandler.NotFound('Bu mashina ushbu brandga tegishli emas'),
			)
		}

		res.status(200).json({
			status: 'success',
			data: {
				brand: car.brand,
				modelName: car.modelName,
				price: car.price,
				year: car.year,
				motor: car.motor,
				color: car.color,
				distance: car.distance,
				gearbook: car.gearbook,
				tanirovka: car.tanirovka,
				description: car.description,
				images: {
					outer: car.outerImage,
					inner: car.innerImage,
					side: car.sideImage,
				},
			},
		})
	} catch (error) {
		next(error)
	}
}

// 3. Mashina qo'shish (Admin)
exports.createCar = async (req, res, next) => {
	try {
		const {
			brand,
			modelName,
			price,
			year,
			motor,
			color,
			distance,
			gearbook,
			tanirovka,
			description,
		} = req.body

		const baseUrl = `${req.protocol}://${req.get('host')}`

		const outerImage = req.files?.outerImage
			? `${baseUrl}/${req.files.outerImage[0].path.replace(process.cwd() + '/', '')}`
			: null
		const innerImage = req.files?.innerImage
			? `${baseUrl}/${req.files.innerImage[0].path.replace(process.cwd() + '/', '')}`
			: null
		const sideImage = req.files?.sideImage
			? `${baseUrl}/${req.files.sideImage[0].path.replace(process.cwd() + '/', '')}`
			: null

		if (!outerImage || !innerImage || !sideImage) {
			return next(CustomErrorHandler.BadRequest('Barcha rasmlarni yuklang'))
		}

		const newCar = await Car.create({
			brand,
			modelName,
			price,
			year,
			motor,
			color,
			distance,
			gearbook,
			tanirovka,
			description,
			outerImage,
			innerImage,
			sideImage,
			addedBy: req.user.id,
		})

		res.status(201).json({
			status: 'success',
			data: newCar,
		})
	} catch (error) {
		next(error)
	}
}

// 4. Mashinani yangilash (Admin)
exports.updateCar = async (req, res, next) => {
	try {
		const { id } = req.params
		const updates = { ...req.body }
		const baseUrl = `${req.protocol}://${req.get('host')}`

		// Eski mashinani olish
		const oldCar = await Car.findById(id)
		if (!oldCar) {
			return next(CustomErrorHandler.NotFound('Mashina topilmadi'))
		}

		const deleteImage = imageUrl => {
			if (!imageUrl) return
			const imagePath = path.join(
				process.cwd(),
				imageUrl.replace(`${process.env.BASE_URL}/`, ''),
			)
			if (fs.existsSync(imagePath)) {
				fs.unlinkSync(imagePath)
			}
		}

		if (req.files?.outerImage) {
			deleteImage(oldCar.outerImage)
			updates.outerImage = `${baseUrl}/${req.files.outerImage[0].path.replace(process.cwd() + '/', '')}`
		}
		if (req.files?.innerImage) {
			deleteImage(oldCar.innerImage)
			updates.innerImage = `${baseUrl}/${req.files.innerImage[0].path.replace(process.cwd() + '/', '')}`
		}
		if (req.files?.sideImage) {
			deleteImage(oldCar.sideImage)
			updates.sideImage = `${baseUrl}/${req.files.sideImage[0].path.replace(process.cwd() + '/', '')}`
		}

		const updatedCar = await Car.findByIdAndUpdate(id, updates, {
			new: true,
			runValidators: true,
		})

		res.status(200).json({
			status: 'success',
			data: updatedCar,
		})
	} catch (error) {
		next(error)
	}
}

// 5. Mashinani o'chirish (Admin)
exports.deleteCar = async (req, res, next) => {
	try {
		const { id } = req.params

		const car = await Car.findByIdAndDelete(id)

		if (!car) {
			return next(CustomErrorHandler.NotFound('Mashina topilmadi'))
		}

		// Rasmlarni o'chirish
		const deleteImage = imageUrl => {
			if (!imageUrl) return
			const imagePath = path.join(
				process.cwd(),
				imageUrl.replace(`${process.env.BASE_URL}/`, ''),
			)
			if (fs.existsSync(imagePath)) {
				fs.unlinkSync(imagePath)
			}
		}

		deleteImage(car.outerImage)
		deleteImage(car.innerImage)
		deleteImage(car.sideImage)

		res.status(200).json({
			status: 'success',
			message: `${car.modelName} o'chirildi`,
		})
	} catch (error) {
		next(error)
	}
}
