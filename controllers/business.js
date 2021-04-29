const Business = require('../models/Business')
const asyncHandler = require('express-async-handler')

// @desc    Fetch all businnesses
// @route   GET /api/businnesses
// @access  Public

exports.getAllBusiness = asyncHandler(async (req, res) => {
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

		const count = await Business.countDocuments({ ...keyword })
		const business = await Business.find({ ...keyword })
			.limit(pageSize)
			.skip(pageSize * (page - 1))

		res.status(200).json({ business, page, pages: Math.ceil(count / pageSize) })
	} catch (error) {
		res.status(400).json({ message: `${error}`.red })
	}
})

// @desc    Fetch single business
// @route   GET /api/businesses/:id
// @access  Public

exports.getBusiness = asyncHandler(async (req, res) => {
	try {
		const business = await Business.findById(req.params.id)
		res.status(200).json({ business })
	} catch (error) {
		res.status(400).json({ message: `${error}`.red })
	}
})

// @desc    Create a business
// @route   POST /api/businesses
// @access  Private/Admin

exports.createBusiness = asyncHandler(async (req, res) => {
	try {
		const {
			name,
			address,
			contact,
			image,
			budget,
			typeBusiness,
			numReviews,
		} = req.body
		const business = await Business.create({
			name,
			address,
			image,
			contact,
			budget,
			typeBusiness,
			numReviews,
		})
		res.status(201).json({ business })
	} catch (error) {
		res.status(400).json({ message: `${error}`.red })
	}
})

// @desc    Update a business
// @route   PUT /api/businesses/:id
// @access  Private/Admin

exports.updateBusiness = asyncHandler(async (req, res) => {
	try {
		const { name, address, image, contact, budget, typeBusiness } = req.body
		const business = await Business.findByIdAndUpdate(req.params.id, {
			name,
			address,
			image,
			contact,
			budget,
			typeBusiness,
		})
		res.status(200).json({ business })
	} catch (error) {
		res.status(400).json({ message: `${error}`.red })
	}
})

// @desc    Delete a business
// @route   DELETE /api/businesses/:id
// @access  Private/Admin

exports.deleteBusiness = asyncHandler(async (req, res) => {
	try {
		await Business.findByIdAndDelete(req.params.id)
		res.status(200).json({ message: 'Deleted Business' })
	} catch (error) {
		res.status(400).json({ message: `${error}`.red })
	}
})

// @desc    Create new review
// @route   POST /api/businesses/:id/reviews
// @access  Private

exports.createBusinessReview = asyncHandler(async (req, res) => {
	try {
		const { rating, comment } = req.body

		const business = await Business.findById(req.params.id)

		if (business) {
			const alreadyReviewed = business.reviews.find(
				r => r.user.toString() === req.user._id.toString()
			)
			if (alreadyReviewed) {
				res.status(400)
				throw new Error('Business already reviewed')
			}

			const review = {
				username: req.user.username,
				rating: Number(rating),
				comment,
				user: req.user._id,
			}

			business.reviews.push(review)

			business.numReviews = business.reviews.length

			business.rating =
				business -
				reviews.reduce((acc, item) => item.rating + acc, 0) /
					business.reviews.length

			await business.save()
			res.status(201).json({ message: 'Review Added' })
		}
	} catch (error) {
		res.status(400).json({ message: `${error}`.red })
	}
})

// @desc    Get top rated businesses
// @route   GET /api/businesses/top
// @access  Public

exports.getTopBusiness = asyncHandler(async (req, res) => {
	try {
		const business = await Business.find({}).sort({ rating: -1 }).limit(3)
		res.status(200).json(business)
	} catch (error) {
		res.status(400).json({ message: `${error}`.red })
	}
})
