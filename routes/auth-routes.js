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

//AUTH ROUTES

authroutes.get('/', (protect, getUsers))
authroutes.get('/profile', (protect, getUserProfile))
authroutes.get('/:id', (protect, deleteUser))
authroutes.post('/', registerUser)
authroutes.post('/login', authUser)
authroutes.put('/profile', (protect, updateUserProfile))
authroutes.put('/:id', (protect, updateUser))
authroutes.delete('/:id', (protect, deleteUser))

module.exports = authroutes
