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

const businessSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, 'Add a store name'],
			unique: [true, 'This store already exists'],
		},

		author: {
			type: {
				type: Schema.Types.ObjectId,
				ref: 'User',
			},
		},

		address: {
			type: String,
			required: [true, 'Add the address'],
		},

		contact: [
			{
				phone: {
					type: Number,
					require: [true, 'Write a phone number'],
					unique: [true, 'This phone number is already in use'],
				},

				email: {
					type: String,
					required: [true, 'Add email'],
					unique: [true, 'This email is already in use'],
				},

				facebook: {
					type: String,
					required: [true, 'Add Facebook'],
					unique: [true, 'This facebook is already in use'],
				},

				instagram: {
					type: String,
					required: [true, 'Add instagram'],
					unique: [true, 'This instagram is already in use'],
				},
			},
		],

		budget: {
			type: String,
			required: [true, 'Add budget'],
		},

		typeBusiness: {
			type: String,
			required: [true, 'Add type of business'],
			enum: ['Store', 'Food', 'Service'],
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
	},
	{
		timestamps: true,
	}
)

const Business = mongoose.model('Business', businessSchema)
module.exports = Business
