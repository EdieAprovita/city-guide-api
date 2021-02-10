const router = require('express').Router()

const {
	getAllBusiness,
	getBusiness,
	createBusiness,
	updateBusiness,
	deleteBusiness,
	createBusinessReview,
	getTopBusiness,
} = require('../controllers/business')

const { protect, admin } = '../middleware/authMiddleware'

//CRUD BUSINESS

router.get('/', getAllBusiness)
router.get('/top', getTopBusiness)
router.get('/:id', getBusiness)
router.post('/create', (protect, admin, createBusiness))
router.post('/:id/reviews', (protect, createBusinessReview))
router.put('/edit/:id', (protect, admin, updateBusiness))
router.delete('/delete/:id', (protect, admin, deleteBusiness))

module.exports = router
