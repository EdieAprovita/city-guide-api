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

const { protect, admin } = require('../middleware/authMiddleware')

//CRUD BUSINESS

router.get('/', getAllBusiness)
router.get('/top', getTopBusiness)
router.get('/:id', getBusiness)
router.post('/create', protect, admin, createBusiness)
router.post('/:id/reviews', protect, createBusinessReview)
router.put('/edit/:id', protect, updateBusiness)
router.delete('/delete/:id', protect, deleteBusiness)

module.exports = router
