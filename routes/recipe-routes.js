const express = require('express')
const router = express.Router()
const uploadConfig = require('../config/cloudinary')
const { getTopMarkets } = require('../controllers/markets')

const { 
	getAllRecipes, 
	getRecipe, 
	createRecipe, 
	updateRecipe, 
	deleteRecipe, 
	getTopRecipes, 
	createRecipeReview 
} = require('../controllers/recipes')

router.post('/upload', uploadConfig.single('photo'), (req, res, next) => {
	if (!req.file) {
		next(new Error('No file uploades'))
	}
	res.status(201).json({ secure_url: req.file.secure_url })
})

//CRUD RECIPES

router.get('/', getAllRecipes)
router.get('/:id', getRecipe)
router.get('/top', getTopRecipes)
router.post('/create', createRecipe)
router.post('/:id/reviews', createRecipeReview)
router.put('/edit/:id', updateRecipe)
router.delete('/delete/:id', deleteRecipe)

module.exports = router
