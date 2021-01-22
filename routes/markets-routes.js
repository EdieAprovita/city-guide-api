const express = require('express')
const router = express.Router()
const uploadConfig = require('../config/cloudinary')

const {
	getAllMarkets,
	getMarket,
	createMarket,
	updateMarket,
	deleteMarket,
	createMarketReview,
	getTopMarkets,
} = require('../controllers/markets')

const { protect } = '../middleware/authMiddleware'

router.post('/upload', uploadConfig.single('photo'), (req, res, next) => {
	if (!req.file) {
		next(new Error('No file uploades'))
	}
	res.status(201).json({ secure_url: req.file.secure_url })
})

//CRUD MARKETS

router.get('/', getAllMarkets)
router.get('/:id', getMarket)
router.get('/top', getTopMarkets)
router.post('/:id/reviews', (protect, createMarketReview))
router.post('/create', (protect, createMarket))
router.put('/edit/:id', (protect, updateMarket))
router.delete('/delete/:id', (protect, deleteMarket))

module.exports = router
