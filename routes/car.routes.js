const Router = require('express')
const { protect, isAdmin } = require('../middlewares/auth.middleware')
const carValidator = require('../validators/car.validator')
const {
	getAllBrands,
	getCarsByBrand,
	createBrand,
} = require('../controllers/car.controller')
const carRouter = Router()
// --- OMMAVIY YO'LLAR (Userlar uchun) ---

// 1. Barcha brendlarni olish
carRouter.get('/brand', getAllBrands)
carRouter.get('/brands/:brand', getCarsByBrand)
carRouter.get('/car/:id')

carRouter.use(protect, isAdmin)

carRouter.post('/brand/add', vali)

// 5. Yangi Mashina qo'shish (Validator bilan birga)
router.post(
	'/car/add',
	uploadCarImages,
	validate(carValidator.create), // Ma'lumotlar to'g'riligini tekshiradi
	carController.createCar,
)

// 6. Tahrirlash va O'chirish
router.patch('/car/:id', uploadCarImages, carController.updateCar)
router.delete('/car/:id', carController.deleteCar)

module.exports = router
