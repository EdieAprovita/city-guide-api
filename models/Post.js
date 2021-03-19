const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},

		text: {
			type: String,
			required: true,
		},

		username: {
			type: String,
		},

		avatar: {
			type: String,
		},

		likes: [
			{
				user: {
					type: Schema.Types.ObjectId,
					ref: 'User',
				},
			},
		],
		comments: [
			{
				user: {
					type: Schema.Types.ObjectId,
					ref: 'User',
				},

				text: {
					type: String,
					required: true,
				},

				avatar: {
					type: String,
				},

				date: {
					type: Date,
					default: Date.now,
				},
			},
		],

		date: {
			type: Date,
			default: Date.now,
		},
	},
	{
		timestamps: true,
	}
)

module.exports = Post = mongoose.model('Post,', postSchema)
