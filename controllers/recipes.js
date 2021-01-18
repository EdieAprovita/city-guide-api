const Recipe = require('../models/Recipe')
const asyncHandler = require('express-async-handler')

exports.getAllRecipes = asyncHandler(async (req, res) => {
	try {
		const recipes = await Recipe.find().populate('User')
		res.status(200).json({ recipes })
	} catch (error) {
		res.status(400).json({ message: `${error}` })
	}
})

exports.getRecipe = asyncHandler(async (req, res) => {
	try {
		const { id } = req.params
		const recipe = await Recipe.findById(id).populate('User')
		res.status(200).json({ recipe })
	} catch (error) {
		res.status(400).json({ message: `${error}` })
	}
})

exports.createRecipe = asyncHandler(async (req, res) => {
	try {
		const {
			title,
			description,
			instructions,
			ingredients,
			typeDish,
			imgUrl,
			cookingTime,
			difficulty,
			budget,
			numReviews,
		} = req.body

		const recipe = await Recipe.create({
			title,
			description,
			instructions,
			ingredients,
			typeDish,
			imgUrl,
			cookingTime,
			difficulty,
			budget,
			numReviews,
		})

		res.status(201).json({ recipe })
	} catch (error) {
		res.status(400).json({ message: `${error}` })
	}
})

exports.updateRecipe = asyncHandler(async (req, res) => {
	try {
		const { id } = req.params
		const {
			title,
			description,
			instructions,
			ingredients,
			typeDish,
			imgUrl,
			cookingTime,
			difficulty,
		} = req.body

		const recipe = await Recipe.findByIdAndUpdate(id, {
			title,
			description,
			instructions,
			ingredients,
			typeDish,
			imgUrl,
			cookingTime,
			difficulty,
		})

		res.status(200).json({ recipe })
	} catch (error) {
		res.status(400).json({ message: `${error}` })
	}
})

exports.deleteRecipe = asyncHandler(async (req, res) => {
	try {
		const { id } = req.params
		await Recipe.findByIdAndDelete(id)
		res.status(200).json({ message: 'deleted recipe' })
	} catch (error) {
		res.status(400).json({ message: `${error}` })
	}
})

exports.createRecipeReview = asyncHandler(async (req, res) => {
	try {
		const { rating, comment } = req.body

		const recipe = await Recipe.findById(req.params.id)

		if (recipe) {
			const alreadyReviewed = recipe.reviews.find(
				r => r.user.toString() === req.user._id.toString()
			)

			if (alreadyReviewed) {
				res.status(400)
				throw new Error('Recipe already reviewed')
			}

			const review = {
				username: req.user.username,
				rating: Number(rating),
				comment,
				user: req.user._id,
			}

			recipe.reviews.push(review)
			recipe.numReviews = recipe.reviews.length
			recipe.rating =
				recipe.reviews.reduce((acc, item) => item.rating + acc, 0) /
				recipe.reviews.length

			await recipe.save()
			res.status(201).json({ message: 'Review Added' })
		}
	} catch (error) {
		res.status(400).json({ message: `${error}` })
	}
})

exports.getTopRecipes = asyncHandler(async (req, res) => {
	try {
		const recipes = await Recipe.find({}).sort({ rating: -1 }).limit(3)
		res.status(200).json(recipes)
	} catch (error) {
		res.status(400).json({ message: `${error}` })
	}
})
