const Doctor = require('../models/Doctor')
const asyncHandler = require('express-async-handler')

//@des Fetch all doctors
//@route GET /api/doctors
//@access Public

exports.getAllDoctors = asyncHandler(async (req, res) => {
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

		const count = await Doctor.countDocuments({ ...keyword })
		const doctors = await Doctor.find({ ...keyword })
			.limit(pageSize)
			.skip(pageSize * (page - 1))

		res.status(200).json({ doctors, page, pages: Math.ceil(count / pageSize) })
	} catch (error) {
		res.status(400).json({ message: `${error}`.red })
	}
})

//@des Fectch single doctor
//@route GET /api/doctors/:id
//@access Public

exports.getDoctor = asyncHandler(async (req, res) => {
	try {
		const { id } = req.params
		const doctor = await Doctor.findById(id)
		res.status(200).json({ doctor })
	} catch (error) {
		res.status(400).json({ message: `${error}`.red })
	}
})

//@des Create a doctor
//@route POST /api/doctors/:id
//@access Private/Admin

exports.createDoctor = asyncHandler(async (req, res) => {
	try {
		const { name, address, image, contact, numReviews } = req.body
		const doctor = await Doctor.create({
			name,
			address,
			image,
			contact,
			numReviews,
		})
		res.status(200).json({ doctor })
	} catch (error) {
		res.status(400).json({ message: `${error}`.red })
	}
})

// @desc    Update a doctor
// @route   PUT /api/doctors/:id
// @access  Private/Admin

exports.updateDoctor = asyncHandler(async (req, res) => {
	try {
		const { id } = req.params
		const { name, image, address, contact } = req.body
		const doctor = await Doctor.findByIdAndUpdate(id, {
			name,
			address,
			image,
			contact,
		})
		res.status(200).json({ doctor })
	} catch (error) {
		res.status(400).json({ message: `${error}`.red })
	}
})

// @desc    Delete a doctor
// @route   DELETE /api/doctors/:id
// @access  Private/Admin

exports.deleteDoctor = asyncHandler(async (req, res) => {
	try {
		const { id } = req.params
		await Doctor.findByIdAndDelete(id)
		res.status(200).json({ message: 'Delete doctor' })
	} catch (error) {
		res.status(400).json({ message: `${error}`.red })
	}
})

// @desc    Create new review
// @route   POST /api/doctors/:id/reviews
// @access  Private

exports.createDoctorReview = asyncHandler(async (req, res) => {
	try {
		const { rating, comment } = req.body
		const doctor = await Doctor.findById(req.params.id)

		if (doctor) {
			const alreadyReviewed = doctor.reviews.find(
				r => r.user.toString() === req.user._id.toString()
			)
			if (alreadyReviewed) {
				res.status(400)
				throw new Error('Doctor already reviewed')
			}

			const review = {
				username: req.user.username,
				rating: Number(rating),
				comment,
				user: req.user._id,
			}

			doctor.reviews.push(review)

			doctor.numReviews = doctor.reviews.length

			doctor.rating =
				doctor -
				reviews.reduce((acc, item) => item.rating + acc, 0) /
					doctor.reviews.length

			await doctor.save()
			res.status(201).json({ message: 'Review Added' })
		}
	} catch (error) {
		res.status(400).json({ message: `${error}`.red })
	}
})

// @desc    Get top rated doctors
// @route   GET /api/doctors/top
// @access  Public

exports.getTopDoctor = asyncHandler(async (req, res) => {
	try {
		const doctor = await Doctor.find({}).sort({ rating: -1 }).limit(3)
		res.status(200).json({ doctor })
	} catch (error) {
		res.status(400).json({ message: `${error}`.red })
	}
})
