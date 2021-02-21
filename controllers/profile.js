const axios = require('axios')
const asyncHandler = require('express-async-handler')
const normalize = require('normalize-url')
const axios = require('axios')
const config = require('config')

const Post = require('../models/Post')
const User = require('../models/User')
const Profile = require('../models/Profile')
const checkObjectId = require('../middlewares/checkObjectId')

// @desc Get current users profile
// @route GET /api/profile/me
// @access Private

exports.getProfile = asyncHandler(async (req, res) => {
	try {
		const profile = await Profile.findOne({
			user: req.user.id,
		}).populate('User', ['username', 'avatar'])

		if (!profile) {
			return res.status(400).json({ message: 'There is no profile for this user' })
		}

		res.status(200).json(profile)
	} catch (error) {
		res.status(400).json({ message: `${error}`.red })
	}
})

// @desc Create or update user profile
// @route POST /api/profile
// @access Private

exports.updateProfile = asyncHandler(async (req, res) => {
	const {
		website,
		skills,
		youtube,
		twitter,
		instagram,
		linkedin,
		facebook,
		...rest
	} = req.body

	const profileFields = {
		user: req.user.id,
		website:
			website && website !== ''
				? normalize(website, { forceHttps: true })
				: skills.split(',').map(skill => ' ' + skill.trim()),
		...rest,
	}

	const socialFields = {
		youtube,
		twitter,
		instagram,
		linkedin,
		facebook,
	}

	for (const [key, value] of Object.entries(socialFields)) {
		if (value && value.length > 0)
			socialFields[key] = normalize(value, { forceHttps: true })
	}
	profileFields.social = socialFields

	try {
		let profile = await Profile.findOneAndUpdate(
			{ user: req.user.id },
			{ $set: profileFields },
			{ new: true, upsert: true, setDefaultsOnInsert: true }
		)

		res.status(200).json(profile)
	} catch (error) {
		res.status(400).json({ message: `${error}`.red })
	}
})

// @desc Get all profiles
// @route GET /api/profile
// @access Public

exports.getAllProfiles = asyncHandler(async (req, res) => {
	try {
		const profiles = await Profile.find().populate('User', ['username', 'avatar'])
		res.status(200).json(profiles)
	} catch (error) {
		res.status(400).json({ message: `${error}`.red })
	}
})

// @desc Get  profile by Id
// @route GET /api/profile/user/:user_id
// @access Public

exports.getProfileById = asyncHandler(checkObjectId("user_id"),async({params:{user_id}}), (req, res) => {
	try {
		const profile = await Profile.findOne({
			user: user_id,
		}).populate('User', ['username', 'avatar'])

		if (!profile) return res.status(400).json({ message: 'Profile not found!' })

		res.status(200).json(profile)
	} catch (error) {
		console.error(error.message)
		res.status(400).json({ message: `${error}`.red })
	}
})

// @desc Delete profile,user & post
// @route DELETE /api/profile
// @access Private

exports.deleteProfile = asyncHandler(async (req, res) => {
	try {
		await Post.deleteMany({ user: req.user.id })
		await Profile.findOneAndRemove({ user: req.user.id })
		await User.findOneAndRemove({ _id: req.user.id })

		res.status(200).json({ message: 'User deleted' })
	} catch (error) {
		res.status(400).json({ message: `${error}`.red })
	}
})

// @desc Add profile experience
// @route PUT /api/profile/experience
// @access Private

exports.addProfileExperience = asyncHandler(async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id })

		profile.experience.unshift(req.body)

		await profile.save()
		res.status(200).json(profile)
	} catch (error) {
		res.status(400).json({ message: `${error}`.red })
	}
})

// @desc Delete experience from profile
// @route DELETE /api/profile/experience/:exp_id
// @access Private

exports.deleteProfileExperience = asyncHandler(async (req, res) => {
	try {
		const foundProfile = await Profile.findOne({ user: req.user.id })

		foundProfile.experience = foundProfile.experience.filter(
			exp => exp._id.toString() !== req.params.exp_id
		)

		await foundProfile.save()
		return res.status(200).json(foundProfile)
	} catch (error) {
		res.status(400).json({ message: `${error}`.red })
	}
})

// @desc Add profile Education
// @route PUT /api/profile/education
// @access Private

exports.addProfileEducation = asyncHandler(async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id })

		profile.education.unshift(req.body)

		await profile.save()

		res.status(200).json(profile)
	} catch (error) {
		res.status(400).json({ message: `${error}`.red })
	}
})

// @desc Delete Education from profile
// @route DELETE /api/profile/education/:edu_id
// @access Private

exports.deleteEducation = asyncHandler(async (req, res) => {
	try {
		const foundProfile = await Profile.findOne({ user: req.user.id })
		foundProfile.education = foundProfile.education.filter(
			edu => edu._id.toString() !== req.params.edu_id
		)

		await foundProfile.save()
		return res.status(200).json(foundProfile)
	} catch (error) {
		res.status(400).json({ message: `${error}`.red })
	}
})

// @desc Get user repos from Github
// @route GET /api/profile/github/:username
// @access Public

exports.githubProfile = asyncHandler(async (req, res) => {
	try {
		const uri = encodeURI(
			`https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
		)

		const headers = {
			'user-agent': 'node.js',
			Authorization: `token ${config.get('githubToken')}`,
		}

		const gitHubResponse = await axios.get(uri, { headers })
		return res.status(200).json(gitHubResponse.data)
	} catch (error) {
		res.status(400).json({ message: `${error}`.red })
	}
})
