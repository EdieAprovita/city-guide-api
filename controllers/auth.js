const User = require('../models/User')
const generateToken = require("../utils/generateToken")
const asyncHandler = require("express-async-handler")

const authUser = asyncHandler(async (req,res) => {
	try {
		
		const {email, password} = req.body
	
		const user = await User.findOne({email})
	
		if(user && (await user.matchPassword(password))) {
			res.json({
				_id:user._id,
				username: user.username,
				email:user.email,
				token:generateToken(user._id),
	
			})
		}
	} catch (error) {
		res.status(401).json({message: `${error}`})
	}
})

const registerUser = asyncHandler(async(req,res) => {
	try {
		const userExists = await User.findOne({email})

		if(userExists) {
			res.status(400).json({message: `This user already exist ${userExists}`.red})
		}

		const user = await User.create({
			username,
			email,
			password,
		})

		if(user) {
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

const getUserProfile = asyncHandler(async(req,res) => {
	try {
		
	} catch (error) {
		
	}
})