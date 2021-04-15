const User = require('../models/User')
const generateToken = require('../utils/generateToken')
const asyncHandler = require('express-async-handler')

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public

exports.authUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body

	const user = await User.findOne({ email })

	if (user && (await user.matchPassword(password))) {
		res.status(200).json({
			_id: user._id,
			username: user.username,
			email: user.email,
			isAdmin: user.isAdmin,
			token: generateToken(user._id),
		})
	} else {
		res.status(401)
		throw new Error({ message: `${Error}`.red })
	}
})

// @desc    Register a new user
// @route   POST /api/auth
// @access  Public

exports.registerUser = asyncHandler(async (req, res) => {
	const { username, email, password } = req.body

	const userExists = await User.findOne({ email })

	if (userExists) {
		res.status(400).json({ message: 'User already exists!!' })
	}

	const user = await User.create({
		username,
		email,
		password,
	})

	if (user) {
		res.status(201).json({
			_id: user._id,
			name: user.username,
			email: user.email,
			isAdmin: user.isAdmin,
			token: generateToken(user._id),
		})
	} else {
		res.status(400)
		throw new Error({ message: `${Error}`.red })
	}
})

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private

exports.getUserProfile = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id)

	if (user) {
		res.status(200).json({ user })
	} else {
		res.status(404)
		throw new Error({ message: `User not found ${Error}`.red })
	}
})

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private

exports.updateUserProfile = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id)

	if (user) {
		user.username = req.body.username || user.username
		user.email = req.body.email || user.email

		if (req.body.password) {
			user.password = req.body.password
		}

		const updatedUser = await user.save()

		res.status(200).json({
			_id: updatedUser._id,
			username: updatedUser.username,
			email: updatedUser.email,
			isAdmin: updatedUser.isAdmin,
			token: generateToken(updatedUser._id),
		})
	} else {
		res.status(404)
		throw new Error({ message: `User not found ${Error}`.red })
	}
})

// @desc    Get all users
// @route   GET /api/auth
// @access  Private/Admin

exports.getUsers = asyncHandler(async (req, res) => {
	try {
		const users = await User.find({})
		res.status(200).json(users.blue.bold)
	} catch (error) {
		res.status(400).json({ message: `${error}`.red })
	}
})

// @desc    Delete user
// @route   DELETE /api/auth/:id
// @access  Private/Admin

exports.deleteUser = asyncHandler(async (req, res) => {
	try {
		const user = await User.findById(req.params.id)

		if (user) {
			await user.remove()
			res.status(200).json({ message: 'User removed'.blue.bold })
		}
	} catch (error) {
		res.status(404).json({ message: `${error}`.red })
	}
})

// @desc    Get user by ID
// @route   GET /api/auth/:id
// @access  Private/Admin

exports.getUserById = asyncHandler(async (req, res) => {
	try {
		const user = await User.findById(req.params.id).select('-password')

		if (user) {
			res.status(200).json(user.blue.bold)
		}
	} catch (error) {
		res.status(404).json({ message: `${error}`.red })
	}
})

// @desc    Update user
// @route   PUT /api/auth/:id
// @access  Private/Admin

exports.updateUser = asyncHandler(async (req, res) => {
	try {
		const user = await User.findById(req.params.id)

		if (user) {
			user.username = req.body.username || user.username
			user.email = req.body.email || user.email
			user.isAdmin = req.body.isAdmin

			const updatedUser = await user.save()

			res.status(200).json({
				_id: updatedUser._id,
				username: updatedUser.username,
				email: updatedUser.email,
				isAdmin: updatedUser.isAdmin,
			})
		}
	} catch (error) {
		res.status(404).json({ message: `${error}`.red })
	}
})
