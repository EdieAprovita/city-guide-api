const Market = require('../models/Market')
const asyncHandler = require('express-async-handler')

// @desc    Fetch all markets
// @route   GET /api/markets
// @access  Public

exports.getAllMarkets = asyncHandler(async (req, res) => {
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

		const count = await Market.countDocuments({ ...keyword })
		const markets = await Market.find({ ...keyword })
			.limit(pageSize)
			.skip(pageSize * (page - 1))
		res.status(200).json({ markets, page, pages: Math.ceil(count / pageSize) })
	} catch (error) {
		res.status(400).json({ message: `${error}`.red })
	}
})

// @desc    Fetch single market
// @route   GET /api/market/:id
// @access  Public

exports.getMarket = asyncHandler(async (req, res) => {
	try {
		const { id } = req.params
		const market = await Market.findById(id).populate('User')
		res.status(200).json({ market })
	} catch (error) {
		res.status(400).json({ message: `${error}`.red })
	}
})

// @desc    Create a market
// @route   POST /api/markets
// @access  Private/Admin

exports.createMarket = asyncHandler(async (req, res) => {
	try {
		const { name, address, image, numReviews } = req.body

		const market = await Market.create({
			name,
			address,
			image,
			numReviews,
		})
		res.status(201).json({ market })
	} catch (error) {
		res.status(400).json({ message: `${error}`.red })
	}
})

// @desc    Update a market
// @route   PUT /api/markets/:id
// @access  Private/Admin

exports.updateMarket = asyncHandler(async (req, res) => {
	try {
		const { id } = req.params
		const { name, address, typeMarket, image } = req.body
		const market = await Market.findByIdAndUpdate(id, {
			name,
			address,
			typeMarket,
			image,
		})
		res.status(200).json({ market })
	} catch (error) {
		res.status(400).json({ message: `${error}`.red })
	}
})

// @desc    Delete a market
// @route   DELETE /api/markets/:id
// @access  Private/Admin

exports.deleteMarket = asyncHandler(async (req, res) => {
	try {
		const { id } = req.params
		await Market.findOneAndDelete(id)
		res.status(200).json({ message: 'Deleted market' })
	} catch (error) {
		res.status(400).json({ message: `${error}`.red })
	}
})

// @desc    Create new review
// @route   POST /api/markets/:id/reviews
// @access  Private

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

// @desc    Get top rated markets
// @route   GET /api/markets/top
// @access  Public

exports.getTopMarkets = asyncHandler(async (req, res) => {
	try {
		const markets = await Market.find({}).sort({ rating: -1 }).limit(3)
		res.status(200).json(markets)
	} catch (error) {
		res.status(400).json({ message: `${error}`.red })
	}
})
