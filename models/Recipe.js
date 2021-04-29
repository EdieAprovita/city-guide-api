const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Review = require('./Review')

const recipeSchema = new Schema(
	{
		title: {
			type: String,
			required: [true, 'Write a title for the recipe'],
			unique: true,
		},

		author: {
			type: {
				type: Schema.Types.ObjectId,
				ref: 'User',
			},
		},

		description: {
			type: String,
			maxlength: [60, 'The description is to big'],
			required: [true, 'Write a recipe description'],
		},

		instructions: {
			type: String,
			required: [true, 'Please add the instructions'],
		},

		ingredients: {
			type: String,
			required: [true, 'Write the ingredients for the recipe'],
		},

		typeDish: {
			type: String,
			enum: ['breakfast', 'lunch', 'dinner', 'dessert'],
			required: [true, 'Write the type of dish please'],
		},

		image: {
			type: String,
			required: [true, 'Add and image for the recipe'],
		},

		cookingTime: {
			type: Number,
			required: [true, 'Write the cooking time'],
		},

		difficulty: {
			type: String,
			required: [true, 'Please assign the difficulty of the recipe'],
			enum: ['amateur', 'semipro', 'chef'],
		},

		reviews: [Review],

		rating: {
			type: Number,
			required: [true, 'Please add the rating'],
			default: 0,
		},

		numReviews: {
			type: Number,
			required: [true, 'Please add the number reviews'],
			default: 0,
		},

		budget: {
			type: String,
			required: [true, 'Add budget'],
			enum: ['cheap', 'average', 'expensive'],
		},
	},
	{
		timestamps: true,
	}
)

module.exports = Recipe = mongoose.model('Recipe', recipeSchema)
