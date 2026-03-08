const multer = require('multer')
const path = require('path')
const fs = require('fs')

const uploadDir = path.join(__dirname, '../uploads/cars')

// Papka mavjudligini tekshirish va yaratish
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true })
}

// Storage konfiguratsiyasi
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, uploadDir)
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
		cb(
			null,
			file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname),
		)
	},
})

// File filter (Faqat rasmlar uchun)
const fileFilter = (req, file, cb) => {
	const allowedTypes = ['.jpg', '.jpeg', '.png', '.webp']
	const ext = path.extname(file.originalname).toLowerCase()

	if (allowedTypes.includes(ext)) {
		cb(null, true)
	} else {
		const error = new Error(
			'Faqat ruxsat etilgan rasm formatlari yuklanishi mumkin (.jpg, .png, .webp)',
		)
		error.code = 'INVALID_FILE_TYPE'
		cb(error, false)
	}
}

const upload = multer({
	storage,
	fileFilter,
	limits: {
		fileSize: 5 * 1024 * 1024,
	},
})

// 1. Mashina uchun 3 ta rasm (outer, inner, side)
exports.uploadCarImages = upload.fields([
	{ name: 'outerImage', maxCount: 1 },
	{ name: 'innerImage', maxCount: 1 },
	{ name: 'sideImage', maxCount: 1 },
])

// 2. Brend uchun bitta rasm
exports.uploadBrandLogo = upload.single('image')
