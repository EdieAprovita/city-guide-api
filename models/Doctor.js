const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Review = require('./Review')

const doctorSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, 'Please add the name doctor'],
			unique: [true, 'This name is already register'],
		},

		author: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},

		address: {
			type: String,
			required: [true, 'Add the address'],
		},

		image: {
			type: String,
			required: [true, 'Add picture'],
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
					unique: [true, 'This facebook is already in use'],
				},

				instagram: {
					type: String,
					unique: [true, 'This instagram is already in use'],
				},
			},
		],

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

module.exports = Doctor = mongoose.model('Doctor', doctorSchema)
