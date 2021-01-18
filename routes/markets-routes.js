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
	getTopMarkets 
} = require('../controllers/markets')

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
router.post('/:id/reviews', createMarketReview)
router.post('/create', createMarket)
router.put('/edit/:id', updateMarket)
router.delete('/delete/:id', deleteMarket)

module.exports = router
