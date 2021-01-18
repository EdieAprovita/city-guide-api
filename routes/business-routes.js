const express = require('express')
const router = express.Router()
const uploadConfig = require('../config/cloudinary')

const {
	getAllBusiness,
	getBusiness,
	createBusiness,
	updateBusiness,
	deleteBusiness,
	createBusinessReview,
	getTopBusiness,
} = require('../controllers/business')

router.post('/upload', uploadConfig.single('photo'), (req, res, next) => {
	if (!req.file) {
		next(new Error('No file uploades'))
	}
	res.status(201).json({ secure_url: req.file.secure_url })
})

//CRUD BUSINESS

router.get('/', getAllBusiness)
router.get('/:id', getBusiness)
router.get('/top', getTopBusiness)
router.post('/:id/reviews', createBusinessReview)
router.post('/create', createBusiness)
router.put('/edit/:id', updateBusiness)
router.delete('/delete/:id', deleteBusiness)

module.exports = router
