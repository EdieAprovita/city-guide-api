const Market = require('../models/Market')
const asyncHandler = require('express-async-handler')

exports.getAllMarkets = asyncHandler(async (req, res) => {
	try {
		const markets = await Market.find().populate('User')
		res.status(200).json({ markets })
	} catch (error) {
		res.status(400).json({ message: `${error}`.red })
	}
})

exports.getMarket = asyncHandler(async (req, res) => {
	try {
		const { id } = req.params
		const market = await Market.findById(id).populate('User')
		res.status(200).json({ market })
	} catch (error) {
		res.status(400).json({ message: `${error}`.red })
	}
})

exports.createMarket = asyncHandler(async (req, res) => {
	try {
		const { name, address, typeMarket, imgUrl, numReviews } = req.body

		const market = await Market.create({
			name,
			address,
			typeMarket,
			imgUrl,
			numReviews,
		})
		res.status(201).json({ market })
	} catch (error) {
		res.status(400).json({ message: `${error}`.red })
	}
})

exports.updateMarket = asyncHandler(async (req, res) => {
	try {
		const { id } = req.params
		const { name, address, typeMarket, imgUrl } = req.body
		const market = await Market.findByIdAndUpdate(id, {
			name,
			address,
			typeMarket,
			imgUrl,
		})
		res.status(200).json({ market })
	} catch (error) {
		res.status(400).json({ message: `${error}`.red })
	}
})

exports.deleteMarket = asyncHandler(async (req, res) => {
	try {
		const { id } = req.params
		await Market.findOneAndDelete(id)
		res.status(200).json({ message: 'Deleted market' })
	} catch (error) {
		res.status(400).json({ message: `${error}`.red })
	}
})

exports.createMarketReview = asyncHandler(async (req, res) => {
	try {
		const { rating, comment } = req.body

		const market = await Market.findById(req.params.id)

		if (market) {
			const alreadyReviewed = market.reviews.find(
				r => r.user.toString() === req.user._id.toString()
			)

			if (alreadyReviewed) {
				res.status(400)
				throw new Error('Market already reviewed')
			}

			const review = {
				username: req.user.username,
				rating: Number(rating),
				comment,
				user: req.user._id,
			}

			market.reviews.push(review)
			market.numReviews = market.reviews.length
			market.rating =
				market.reviews.reduce((acc, item) => item.rating + acc, 0) /
				market.reviews.length

			await market.save()
			res.status(201).json({ message: 'Review Added' })
		}
	} catch (error) {
		res.status(400).json({ message: `${error}`.red })
	}
})

exports.getTopMarkets = asyncHandler(async (req, res) => {
	try {
		const markets = await Market.find({}).sort({ rating: -1 }).limit(3)
		res.status(200).json(markets)
	} catch (error) {
		res.status(400).json({ message: `${error}`.red })
	}
})
