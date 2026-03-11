const { Router } = require('express')
const {
	getAllBrands,
	getBrand,
	createBrand,
	updateBrand,
	deleteBrand,
} = require('../controllers/brand.controller')
const { protect, isAdmin } = require('../middlewares/auth.middleware')
const { uploadBrandLogo } = require('../middlewares/upload.middleware')

const brandRouter = Router()

brandRouter.get('/', getAllBrands)
brandRouter.get('/:id', getBrand)
brandRouter.post('/', protect, isAdmin, uploadBrandLogo, createBrand)
brandRouter.put('/:id', protect, isAdmin, uploadBrandLogo, updateBrand)
brandRouter.delete('/:id', protect, isAdmin, deleteBrand)

module.exports = brandRouter
