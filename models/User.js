const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema(
	{
		username: {
			type: String,
			required: [true, 'Please type a username'],
			unique: [true, 'This username is already in use'],
		},
		email: {
			type: String,
			required: [true, 'Please type a email'],
			unique: [true, 'This email is already in use'],
		},

		photo: {
			type: String,
			default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRAhE9DUIhm4jhJDKKsQT2qq4WRSv9n7rHBig&usqp=CAU',
		},

		password: {
			type: String,
			required: [true, 'Please type a password!'],
		},
	},
	{
		timestamps: true,
	},
)

const User = mongoose.model('User', userSchema)
module.exports = User
