const router = require('express').Router()
const protect = require('../middleware/authMiddleware')

const {
	getAllProfiles,
	getProfile,
	getProfileById,
	updateProfile,
	deleteProfile,
	addProfileEducation,
	addProfileExperience,
	githubProfile,
	deleteEducation,
	deleteProfileExperience,
} = require('../controllers/profile')

router.get('/all', getAllProfiles)
router.get('/me', (protect, getProfile))
route.get('/user/:user_id', getProfileById)
router.get('/github/:username', githubProfile)
router.post('/update', (protect, updateProfile))
router.post('/experience'(protect, addProfileExperience))
router.post('/education', (protect, addProfileEducation))
router.delete('/delete', (protect, deleteProfile))
router.delete('/education/delete', (protect, deleteEducation))
router.delete('/experience/delete', (protect, deleteProfileExperience))

module.exports = router
