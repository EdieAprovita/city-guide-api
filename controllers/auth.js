const User = require('../models/User')
const generateToken = require('../utils/generateToken')
const asyncHandler = require('express-async-handler')

export const authUser = asyncHandler(async (req, res) => {
	try {
		const { email, password } = req.body

		const user = await User.findOne({ email })

		if (user && (await user.matchPassword(password))) {
			res.json({
				_id: user._id,
				username: user.username,
				email: user.email,
				token: generateToken(user._id),
			})
		}
	} catch (error) {
		res.status(401).json({ message: `${error}` })
	}
})

export const registerUser = asyncHandler(async (req, res) => {
	try {
		const userExists = await User.findOne({ email })

		if (userExists) {
			res.status(400).json({ message: `This user already exist ${userExists}`.red })
		}

		const user = await User.create({
			username,
			email,
			password,
		})

		if (user) {
			res.status(201).json({
				_id: user._id,
				username: user.username,
				email: user.email,
				token: generateToken(user._id),
			})
		}
	} catch (error) {
		res.status(400).json({ message: `${error}`.red })
	}
})

export const getUserProfile = asyncHandler(async (req, res) => {
	try {
		const user = await User.findById(req.user._id)

		if (user) {
			res.json({
				_id: user._id,
				username: user.username,
				email: user.email,
				token: generateToken(user._id),
			})
		}
	} catch (error) {
		res.status(400).json({ message: `${error}`.red })
	}
})

export const updateUserProfile = asyncHandler(async (req, res) => {
	try {
		const user = await User.findById(req.user._id)

		if (user) {
			user.username = req.body.username || user.username
			user.email = req.body.email || user.email

			if (req.body.password) {
				user.password = req.body.password
			}

			const updatedUser = await user.save()

			res.json({
				_id: updatedUser._id,
				username: updatedUser.username,
				email: updatedUser.email,
				token: generateToken(updatedUser._id),
			})
		}
	} catch (error) {
		res.status(400).json({ message: `User not found ${error}`.red })
	}
})

export const getUser = asyncHandler(async (req, res) => {
	try {
		const users = await User.find({})
		res.status(200).json(users)
	} catch (error) {
		res.status(400).json({ message: `${error}`.red })
	}
})

export const deleteUser = asyncHandler(async (req, res) => {
	try {
		const user = await User.findById(req.params.id)

		if (user) {
			await user.remove()
			res.status(200).json({ message: 'User removed' })
		}
	} catch (error) {
		res.status(404).json({ message: `${error}`.red })
	}
})

export const getUserById = asyncHandler(async (req, res) => {
	try {
		const user = await User.findById(req.params.id).select('-password')

		if (user) {
			res.status(200).json(user)
		}
	} catch (error) {
		res.status(404).json({ message: `${error}`.red })
	}
})

export const updateUser = asyncHandler(async (req, res) => {
	try {
		const user = await User.findById(req.params.id)

		if (user) {
			user.username = req.body.username || user.username
			user.email = req.body.email || user.email

			const updatedUser = await user.save()

			res.status(200).json({
				_id: updatedUser._id,
				username: updatedUser.username,
				email: updatedUser.email,
			})
		}
	} catch (error) {
		res.status(404).json({ message: `${error}`.red })
	}
})
