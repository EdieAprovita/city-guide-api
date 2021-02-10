const express = require('express')
const router = express.Router()

const {
	getAllMarkets,
	getMarket,
	createMarket,
	updateMarket,
	deleteMarket,
	createMarketReview,
	getTopMarkets,
} = require('../controllers/markets')

const { protect, admin } = '../middleware/authMiddleware'

//CRUD MARKETS

router.get('/', getAllMarkets)
router.get('/:id', getMarket)
router.get('/top', getTopMarkets)
router.post('/:id/reviews', (protect, createMarketReview))
router.post('/create', (protect, admin, createMarket))
router.put('/edit/:id', (protect, admin, updateMarket))
router.delete('/delete/:id', (protect, admin, deleteMarket))

module.exports = router
