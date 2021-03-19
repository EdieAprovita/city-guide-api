const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Review = require('./Review')

const restaurantSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, 'Please write a name for the Place'],
			unique: [true, 'This place is already register'],
		},

		author: {
			type: {
				type: Schema.Types.ObjectId,
				ref: 'User',
			},
		},

		typePlace: {
			type: String,
			required: [true, 'Please specify the type place'],
			enum: ['Restaurante', 'Puesto Callejero'],
		},

		address: {
			type: String,
			required: [true, 'Please type de address'],
		},

		imgUrl: {
			type: String,
			required: [true, 'Please add a photo'],
		},

		budget: {
			type: String,
			required: [true, 'Add the budget'],
			enum: ['cheap', 'average', 'expensive'],
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
	},
	{
		timestamps: true,
	}
)

module.exports = Restaurant = mongoose.model('Restaurant', restaurantSchema)
