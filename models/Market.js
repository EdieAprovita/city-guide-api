const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Review = require('./Review')

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

		image: {
			type: String,
			required: [true, 'Add picture'],
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

		imgUrl: {
			type: String,
			required: [true, 'Please add a photo'],
		},
	},

	{
		timestamps: true,
	}
)

module.exports = Market = mongoose.model('Market', marketSchema)
