const router = require('express').Router()

const { deleteBusiness } = require('../controllers/business')
const {
	getAllDoctors,
	getDoctor,
	createDoctor,
	updateDoctor,
	deleteDoctor,
	createDoctorReview,
	getTopDoctor,
} = require('../controllers/doctors')

const { protect, admin } = require('../middleware/authMiddleware')

//CRUD DOCTOR

router.get('/', getAllDoctors)
router.get('/top', getTopDoctor)
router.get('/:id', getDoctor)
router.post('/create', (protect, admin, createDoctor))
router.post('/:id/reviews', (protect, createDoctorReview))
router.put('/edit/:id', (protect, admin, updateDoctor))
router.delete('/delete/:id', (protect, admin, deleteBusiness))

module.exports = router
