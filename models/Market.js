const mongoose = require('mongoose')
const Schema = mongoose.Schema

const reviewSchema = new Schema(
	{
		username: {
			type: String,
			required: [true, 'Please add a name'],
		},

		rating: {
			type: Number,
			required: [true, 'Please add a rating'],
		},

		comment: {
			type: String,
			required: [true, 'Please write a comment'],
		},

		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: [true, 'Please add a user'],
		},
	},
	{
		timestamps: true,
	}
)

const marketSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, 'Please write a name'],
			unique: [true, 'That name is already register'],
		},

		author: {
			type: {
				type: Schema.Types.ObjectId,
				ref: 'User',
			},
		},

		address: {
			type: String,
			required: [true, 'Please add and address'],
		},

		typeMarket: {
			type: String,
			required: [true, 'Please add a type of market'],
			enum: ['Mercado', 'Local', 'Mercado Local'],
		},

		reviews: [reviewSchema],

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

		imgUrl: {
			type: String,
			required: [true, 'Please add a photo'],
		},
	},

	{
		timestamps: true,
	}
)

const Market = mongoose.model('Market', marketSchema)
module.exports = Market
