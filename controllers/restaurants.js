const Restaurant = require('../models/Restaurant')
const asyncHandler = require('express-async-handler')

// @desc    Fetch all restaurants
// @route   GET /api/restaurants
// @access  Public

exports.getAllRestaurants = asyncHandler(async (req, res) => {
	try {
		const pageSize = 10
		const page = Number(req.query.pageNumber) || 1

		const keyword = req.query.pageNumber
			? {
					name: {
						$regex: req.query.keyword,
						$options: 'i',
					},
			  }
			: {}

		const count = await Restaurant.countDocuments({ ...keyword })
		const restaurants = await Restaurant.find({ ...keyword })
			.limit(pageSize)
			.skip(pageSize * (page - 1))

		res.status(200).json({ restaurants, page, pages: Math.ceil(count / pageSize) })
	} catch (error) {
		res.status(400).json({ message: `${error}` })
	}
})

// @desc    Fetch single restaurant
// @route   GET /api/restaurants/:id
// @access  Public

exports.getRestaurant = asyncHandler(async (req, res) => {
	try {
		const { id } = req.params
		const restaurant = await Restaurant.findById(id).populate('User')
		res.status(200).json({ restaurant })
	} catch (error) {
		res.status(400).json({ message: `${error}` })
	}
})

// @desc    Create a restaurant
// @route   POST /api/restaurants
// @access  Private/Admin

exports.createRestaurant = asyncHandler(async (req, res) => {
	try {
		const { name, typePlace, address, image, budget, numReviews } = req.body

		const restaurant = await Restaurant.create({
			name,
			typePlace,
			address,
			image,
			budget,
			numReviews,
		})
		res.status(201).json({ restaurant })
	} catch (error) {
		res.status(400).json({ message: `${error}` })
	}
})

// @desc    Update a restaurant
// @route   PUT /api/restaurants/:id
// @access  Private/Admin

exports.updateRestaurant = asyncHandler(async (req, res) => {
	try {
		const { id } = req.params
		const { name, typePlace, address, image, budget } = req.body
		const restaurant = await Restaurant.findByIdAndUpdate(id, {
			name,
			typePlace,
			address,
			image,
			budget, 
		})
		res.status(200).json({ restaurant })
	} catch (error) {
		res.status(400).json({ message: `${error}` })
	}
})

// @desc    Delete a restaurant
// @route   DELETE /api/restaurants/:id
// @access  Private/Admin

exports.deleteRestaurant = asyncHandler(async (req, res) => {
	try {
		const { id } = req.params
		await Restaurant.findByIdAndDelete(id)
		res.status(200).json({ message: 'Deleted Restaurant' })
	} catch (error) {
		res.status(400).json({ message: `${error}` })
	}
})

// @desc    Create new review
// @route   POST /api/restaurants/:id/reviews
// @access  Private

exports.createRestaurantReview = asyncHandler(async (req, res) => {
	try {
		const { rating, comment } = req.body

		const restaurant = await Restaurant.findById(req.params.id)

		if (restaurant) {
			const alreadyReviewed = restaurant.reviews.find(
				r => r.user.toString() === req.user._id.toString()
			)

			if (alreadyReviewed) {
				res.status(400)
				throw new Error('Restaurant already Reviewed')
			}

			const review = {
				username: req.user.username,
				rating: Number(rating),
				comment,
				user: req.user._id,
			}

			restaurant.reviews.push(review)
			restaurant.numReviews = restaurant.reviews.length
			restaurant.rating =
				restaurant.reviews.reduce((acc, item) => item.rating + acc, 0) /
				restaurant.reviews.length

			await restaurant.save()
			res.status(201).json({ message: 'Review Added' })
		}
	} catch (error) {
		res.status(400).json({ message: `${error}` })
	}
})

// @desc    Get top rated restaurants
// @route   GET /api/restaurants/top
// @access  Public

exports.getTopRestaurants = asyncHandler(async (req, res) => {
	try {
		const restaurants = await Restaurant.find({}).sort({ rating: -1 }).limit(3)
		res.status(200).json(restaurants)
	} catch (error) {
		res.status(400).json({ message: `${error}` })
	}
})
