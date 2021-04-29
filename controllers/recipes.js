const Recipe = require('../models/Recipe')
const asyncHandler = require('express-async-handler')

// @desc    Fetch all recipes
// @route   GET /api/recipes
// @access  Public

exports.getAllRecipes = asyncHandler(async (req, res) => {
	try {
		const pageSize = 10
		const page = Number(req.query.pageNumber) || 1

		const keyword = req.query.pageNumber
			? {
					name: {
						$regex: req.query.keyword,
						$options: 'i',
					},
			  }
			: {}

		const count = await Recipe.countDocuments({ ...keyword })
		const recipes = await Recipe.find({ ...keyword })
			.limit(pageSize)
			.skip(pageSize * (page - 1))

		res.status(200).json({ recipes, page, pages: Math.ceil(count / pageSize) })
	} catch (error) {
		res.status(400).json({ message: `${error}` })
	}
})

// @desc    Fetch single recipe
// @route   GET /api/recipes/:id
// @access  Public

exports.getRecipe = asyncHandler(async (req, res) => {
	try {
		const { id } = req.params
		const recipe = await Recipe.findById(id)
		res.status(200).json({ recipe })
	} catch (error) {
		res.status(400).json({ message: `${error}` })
	}
})

// @desc    Create a market
// @route   POST /api/markets
// @access  Private/Admin

exports.createRecipe = asyncHandler(async (req, res) => {
	try {
		const {
			title,
			description,
			instructions,
			ingredients,
			typeDish,
			image,
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
			image,
			cookingTime,
			difficulty,
			budget,
			numReviews,
		})

		res.status(201).json({ recipe })
	} catch (error) {
		res.status(400).json({ message: `${error}`.red })
	}
})

// @desc    Update a market
// @route   PUT /api/markets/:id
// @access  Private/Admin

exports.updateRecipe = asyncHandler(async (req, res) => {
	try {
		const { id } = req.params
		const {
			title,
			description,
			instructions,
			ingredients,
			typeDish,
			image,
			cookingTime,
			difficulty,
		} = req.body

		const recipe = await Recipe.findByIdAndUpdate(id, {
			title,
			description,
			instructions,
			ingredients,
			typeDish,
			image,
			cookingTime,
			difficulty,
		})

		res.status(200).json({ recipe })
	} catch (error) {
		res.status(400).json({ message: `${error}` })
	}
})

// @desc    Delete a market
// @route   DELETE /api/markets/:id
// @access  Private/Admin

exports.deleteRecipe = asyncHandler(async (req, res) => {
	try {
		const { id } = req.params
		await Recipe.findByIdAndDelete(id)
		res.status(200).json({ message: 'deleted recipe' })
	} catch (error) {
		res.status(400).json({ message: `${error}` })
	}
})

// @desc    Create new review
// @route   POST /api/recipes/:id/reviews
// @access  Private

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

// @desc    Get top rated markets
// @route   GET /api/markets/top
// @access  Public

exports.getTopRecipes = asyncHandler(async (req, res) => {
	try {
		const recipes = await Recipe.find({}).sort({ rating: -1 }).limit(3)
		res.status(200).json(recipes)
	} catch (error) {
		res.status(400).json({ message: `${error}` })
	}
})
