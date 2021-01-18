const Restaurant = require('../models/Restaurant')
const asyncHandler = require('express-async-handler')

exports.getAllRestaurants = asyncHandler(async (req, res) => {
	try {
		const restaurant = await Restaurant.find().populate('User')
		res.status(200).json({ restaurant })
	} catch (error) {
		res.status(400).json({ message: `${error}` })
	}
})

exports.getRestaurant = asyncHandler(async (req, res) => {
	try {
		const { id } = req.params
		const restaurant = await Restaurant.findById(id).populate('User')
		res.status(200).json({ restaurant })
	} catch (error) {
		res.status(400).json({ message: `${error}` })
	}
})

exports.createRestaurant = asyncHandler(async (req, res) => {
	try {
		const { name, typePlace, address, imgUrl, budget, numReviews } = req.body

		const restaurant = await Restaurant.create({
			name,
			typePlace,
			address,
			imgUrl,
			budget,
			numReviews,
		})
		res.status(201).json({ restaurant })
	} catch (error) {
		res.status(400).json({ message: `${error}` })
	}
})

exports.updateRestaurant = asyncHandler(async (req, res) => {
	try {
		const { id } = req.params
		const { name, typePlace, address, imgUrl, budget } = req.body
		const restaurant = await Restaurant.findByIdAndUpdate(id, {
			name,
			typePlace,
			address,
			imgUrl,
			budget,
		})
		res.status(200).json({ restaurant })
	} catch (error) {
		res.status(400).json({ message: `${error}` })
	}
})

exports.deleteRestaurant = asyncHandler(async (req, res) => {
	try {
		const { id } = req.params
		await Restaurant.findByIdAndDelete(id)
		res.status(200).json({ message: 'Deleted Restaurant' })
	} catch (error) {
		res.status(400).json({ message: `${error}` })
	}
})

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

exports.getTopRestaurants = asyncHandler(async (req, res) => {
	try {
		const restaurants = await Restaurant.find({}).sort({ rating: -1 }).limit(3)
		res.status(200).json(restaurants)
	} catch (error) {
		res.status(400).json({ message: `${error}` })
	}
})
