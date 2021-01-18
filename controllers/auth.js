const User = require('../models/User')
const bcrypt = require('bcryptjs')
const asyncHandler = require("express-async-handler")
const passport = require('passport')

exports.signup = asyncHandler(async (req, res) => {
	try {
		const { email, password } = req.body

		if (!email || !password) {
			res.status(403).json({ message: 'Plead write email and password' })
		}
		const user = await User.findOne({ email })

		if (user) {
			return res.status(400).json({ message: 'This user already exists' })
		}

		const hassPass = bcrypt.hashSync(password, bcrypt.genSaltSync(12))

		const newUser = await User.create({
			email,
			password: hassPass,
		})

		newUser.password = null

		res.status(201).json(newUser)
	} catch (error) {
		res.status(400).json({ message: `${error}`.red })
	}
})

exports.login = asyncHandler(async (req, res, next) => {
	passport.authenticate('local', (err, user, failureDetails) => {
		if (err) {
			return res.status(500).json({ message: `${err}` })
		}
		if (!user) {
			return res.status(401).json(failureDetails)
		}

		res.login(user, err => {
			if (err) {
				return status(500).json({ message: 'Something went wrong' })
			}
			user.password = null
			res.status(200).json(user)
		})
	})(req, res, next)
})

exports.currentUser = async (req, res) => {
	res.json(req.user || null)
}

exports.logout = (req, res) => {
	req.logout()
	res.status(200).json({ message: 'Logget Out' })
}
