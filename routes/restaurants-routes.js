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
router.post('/:id/reviews', createRestaurantReview)
router.post('/create', createRestaurant)
router.put('/edit/:id', updateRestaurant)
router.delete('/delete/:id', deleteRestaurant)

module.exports = router
