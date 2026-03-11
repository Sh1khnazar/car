const Brand = require('../models/brand')
const CustomErrorHandler = require('../utils/custom-error.handler')

// 1. Barcha brandlarni olish
exports.getAllBrands = async (req, res, next) => {
	try {
		const brands = await Brand.find()

		res.status(200).json({
			status: 'success',
			results: brands.length,
			data: brands,
		})
	} catch (error) {
		next(error)
	}
}

// 2. Bitta brandni olish
exports.getBrand = async (req, res, next) => {
	try {
		const brand = await Brand.findById(req.params.id)

		if (!brand) {
			return next(CustomErrorHandler.NotFound('Brand topilmadi'))
		}

		res.status(200).json({
			status: 'success',
			data: brand,
		})
	} catch (error) {
		next(error)
	}
}

// 3. Yangi brand qo‘shish (Admin)
exports.createBrand = async (req, res, next) => {
	try {
		const { name } = req.body
		const image = req.file ? req.file.path : null

		if (!image) {
			return next(CustomErrorHandler.BadRequest('Brend logotipini yuklang'))
		}

		const newBrand = await Brand.create({
			name,
			image,
		})

		res.status(201).json({
			status: 'success',
			data: newBrand,
		})
	} catch (error) {
		next(error)
	}
}

// 4. Brandni yangilash (Admin)
exports.updateBrand = async (req, res, next) => {
	try {
		const { id } = req.params
		const { name } = req.body

		const image = req.file ? req.file.path : undefined

		const updatedBrand = await Brand.findByIdAndUpdate(
			id,
			{ name, ...(image && { image }) },
			{ new: true, runValidators: true },
		)

		if (!updatedBrand) {
			return next(CustomErrorHandler.NotFound('Brand topilmadi'))
		}

		res.status(200).json({
			status: 'success',
			data: updatedBrand,
		})
	} catch (error) {
		next(error)
	}
}

// 5. Brandni o‘chirish (Admin)
exports.deleteBrand = async (req, res, next) => {
	try {
		const { id } = req.params

		const brand = await Brand.findByIdAndDelete(id)

		if (!brand) {
			return next(CustomErrorHandler.NotFound('Brand topilmadi'))
		}

		if (brand.image) {
			const imagePath = path.join(process.cwd(), brand.image)
			if (fs.existsSync(imagePath)) {
				fs.unlinkSync(imagePath)
			}
		}

		res.status(200).json({
			status: 'success',
			message: `Brand o‘chirildi`,
		})
	} catch (error) {
		next(error)
	}
}
