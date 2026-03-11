const { Router } = require('express')
const {
	getCarsByBrand,
	getCar,
	createCar,
	updateCar,
	deleteCar,
} = require('../controllers/car.controller')
const { protect, isAdmin } = require('../middlewares/auth.middleware')
const { validate } = require('../middlewares/validate.middleware')
const { carSchema } = require('../validators/car.validator')
const { uploadCarImages } = require('../middlewares/upload.middleware')

const carRouter = Router()

carRouter.get('/:brandName', getCarsByBrand)
carRouter.get('/:brandName/:id', getCar)
carRouter.post(
	'/',
	protect,
	isAdmin,
	uploadCarImages,
	validate(carSchema),
	createCar,
)
carRouter.put(
	'/:id',
	protect,
	isAdmin,
	uploadCarImages,
	validate(carSchema),
	updateCar,
)
carRouter.delete('/:id', protect, isAdmin, deleteCar)

module.exports = carRouter
