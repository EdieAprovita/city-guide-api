const router = require('express').Router()

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

const { protect, admin } = require('../middleware/authMiddleware')

//AUTH ROUTES

router.get('/', protect, admin, getUsers)
router.get('/profile', protect, getUserProfile)
router.get('/:id', protect, admin, getUserById)
router.post('/signup', registerUser)
router.post('/login', authUser)
router.put('/profile/updateMe', protect, updateUserProfile)
router.put('/update/:id', protect, admin, updateUser)
router.delete('/delete/:id', protect, admin, deleteUser)

module.exports = router
