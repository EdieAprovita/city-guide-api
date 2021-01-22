const express = require('express')
const authroutes = express.Router()

const {
	authUser,
	registerUser,
	getUserProfile,
	updateUserProfile,
	getUsers,
	deleteUser,
	getUserById,
	updateUser,
} = require('../controllers/auth')

const { protect } = require('../middleware/authMiddleware')

authroutes.route('/').post(registerUser).get(protect, getUsers)
authroutes.post('/login', authUser)
authroutes.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile)
authroutes
	.route('/:id')
	.delete(protect, deleteUser)
	.get(protect, getUserById)
	.put(protect, updateUser)

module.exports = authroutes
