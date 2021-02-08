const express = require('express')
const router = express.Router()
const { getTopMarkets } = require('../controllers/markets')

const {
	getAllRecipes,
	getRecipe,
	createRecipe,
	updateRecipe,
	deleteRecipe,
	getTopRecipes,
	createRecipeReview,
} = require('../controllers/recipes')

const { protect } = '../middleware/authMiddleware'

//CRUD RECIPES

router.get('/', getAllRecipes)
router.get('/:id', getRecipe)
router.get('/top', getTopRecipes)
router.post('/create', (protect, createRecipe))
router.post('/:id/reviews', (protect, createRecipeReview))
router.put('/edit/:id', (protect, updateRecipe))
router.delete('/delete/:id', (protect, deleteRecipe))

module.exports = router
