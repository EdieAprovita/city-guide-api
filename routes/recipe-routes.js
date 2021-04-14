const router = require('express').Router()

const {
	getAllRecipes,
	getRecipe,
	createRecipe,
	updateRecipe,
	deleteRecipe,
	getTopRecipes,
	createRecipeReview,
} = require('../controllers/recipes')

const { protect } = require('../middleware/authMiddleware')

//CRUD RECIPES

router.get('/', getAllRecipes)
router.get('/:id', getRecipe)
router.get('/top', getTopRecipes)
router.post('/create', protect, createRecipe)
router.post('/:id/reviews', protect, createRecipeReview)
router.put('/edit/:id', protect, updateRecipe)
router.delete('/delete/:id', protect, deleteRecipe)

module.exports = router
