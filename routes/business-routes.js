const router = require("express").Router()
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

const { protect } = '../middleware/authMiddleware'

router.post('/upload', uploadConfig.single('photo'), (req, res, next) => {
	if (!req.file) {
		next(new Error('No file uploades'))
	}
	res.status(201).json({ secure_url: req.file.secure_url })
})

//CRUD BUSINESS

router.get('/', getAllBusiness)
router.get('/top', getTopBusiness)
router.get('/:id', getBusiness)
router.post('/create', (protect, createBusiness))
router.post('/:id/reviews', (protect, createBusinessReview))
router.put('/edit/:id', (protect, updateBusiness))
router.delete('/delete/:id', (protect, deleteBusiness))

module.exports = router
