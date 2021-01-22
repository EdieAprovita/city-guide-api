const express = require('express')
const router = express.Router()
const uploadConfig = require('../config/cloudinary')

const {
	getAllRestaurants,
	getRestaurant,
	createRestaurant,
	updateRestaurant,
	deleteRestaurant,
	getTopRestaurants,
	createRestaurantReview,
} = require('../controllers/restaurants')

const { protect } = '../middleware/authMiddleware'

router.post('/upload', uploadConfig.single('photo'), (req, res, next) => {
	if (!req.file) {
		next(new Error('No file uploades'))
	}
	res.status(201).json({ secure_url: req.file.secure_url })
})

//CRUD RESTAURANTS

router.get('/', getAllRestaurants)
router.get('/:id', getRestaurant)
router.get('/top', getTopRestaurants)
router.post('/:id/reviews', (protect, createRestaurantReview))
router.post('/create', (protect, createRestaurant))
router.put('/edit/:id', (protect, updateRestaurant))
router.delete('/delete/:id', (protect, deleteRestaurant))

module.exports = router
