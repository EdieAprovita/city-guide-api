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
			required: [true, 'There is no User'],
			ref: 'User',
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

const Doctor = mongoose.model('Doctor', doctorSchema)
module.exports = Doctor
