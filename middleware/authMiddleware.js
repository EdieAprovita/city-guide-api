const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/User')

exports.protect = asyncHandler(async (req, res, next) => {
	let token

	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		try {
			token = req.headers.authorization.split(' ')[1]

			const decoded = jwt.verify(token, process.env.JWT_SECRET)

			res.user = await User.findById(decoded.id).select('-password')

			next()
		} catch (error) {
			res.status(401).json({ message: 'You cannot PASS!!' })
		}
	}

	if (!token) {
		res.status(401).json({ message: 'You cannot PASS!! No authorized' })
	}
})
