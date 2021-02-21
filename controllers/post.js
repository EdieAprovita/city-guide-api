const asyncHandler = require('express-async-handler')

const Post = require('../models/Post')
const User = require('../models/User')
const checkObjectId = require('../middlewares/checkObjectId')

// @desc Create a post
// @route POST /api/posts
// @access Private

exports.createPost = asyncHandler(async (req, res) => {
	try {
		const { id } = req.params
		const user = await User.findById(id)

		const newPost = new Post({
			text: req.body.text,
			username: user.username,
			avatar: user.avatar,
			user: req.user.id,
		})

		const post = await newPost.save('Post created')

		res.status(200).json(post)
	} catch (error) {
		res.status(400).json({ message: `${error}`.red })
	}
})

// @desc Get All Posts
// @route GET /api/posts
// @access Private

exports.getAllPosts = asyncHandler(async (req, res) => {
	try {
		const posts = await Post.find().sort({ date: -1 })
		res.status(200).json({ posts })
	} catch (error) {
		res.status(400).json({ message: `${error}`.red })
	}
})

// @desc Get Post By Id
// @route GET /api/posts/:id
// @access Private

exports.getPostById = asyncHandler(checkObjectId('id'), async (req, res) => {
	try {
		const { id } = req.params
		const post = await Post.findById(id)

		if (!post) {
			return res.status(404).json({ message: 'Sorry there is not a post found' })
		}

		res.status(200).json(post)
	} catch (error) {
		res.status(400).json({ message: `${error}`.red })
	}
})

// @desc Delete a Post By Id
// @route DELETE /api/posts/:id
// @access Private

exports.deletePostById = asyncHandler(checkObjectId('id'), async (req, res) => {
	try {
		const post = await Post.findById(req.params.id)

		if (!post) {
			return res.status(404).json({ message: 'Sorry there is not a post found' })
		}

		if (post.user.toString() !== req.user.id) {
			return res.status(401).json({ message: 'User not authorized!!' })
		}

		await post.remove()
		res.status(200).json({ message: 'Deleted post' })
	} catch (error) {
		res.status(400).json({ message: `${error}`.red })
	}
})

// @desc Like a Post
// @route PUT /api/posts/like/:id
// @access Private

exports.likePost = asyncHandler(checkObjectId('id'), async (req, res) => {
	try {
		const post = await Post.findById(req.params.id)

		if (post.likes.some(like => like.user.toString() === req.user.id)) {
			return res.status(400).json({ message: 'Already liked, sorry mate!!' })
		}

		post.likes.unshift({ user: req.user.id })

		await post.save()

		return res.status(200).json(post.likes)
	} catch (error) {
		res.status(400).json({ message: `${error}`.red })
	}
})

// @desc Unlike a Post
// @route PUT /api/posts/unlike/:id
// @access Private

exports.unlikePost = asyncHandler(checkObjectId('id'), async (req, res) => {
	try {
		const post = await Post.findById(req.params.id)

		if (!post.likes.some(like => like.user.toString() === req.user.id)) {
			return res.status(400).json({ message: 'Not yet benn liked!' })
		}

		post.likes = post.likes.filter(({ user }) => user.toString() !== req.user.id)

		await post.save()

		return res.status(200).json(post.likes)
	} catch (error) {
		res.status(400).json({ message: `${error}`.red })
	}
})

// @desc Comment on a Post
// @route POST /api/posts/comment/:id
// @access Private

exports.commentPost = asyncHandler(checkObjectId("id"),async (req, res) => {
	try {
		const user = await User.findById(req.user.id)
		const post = await Post.findById(req.params.id)

		const newComment = {
			text: req.body.text,
			username: user.username,
			avatar: user.avatar,
			user: req.user.id,
		}

		post.comments.unshift(newComment)

		await post.save()

		res.status(200).json(post.comments)
	} catch (error) {
		res.status(400).json({ message: `${error}`.red })
	}
})

// @desc Delete Comment on a Post
// @route DELETE /api/posts/comment/:id/:comment_id
// @access Private

exports.deleteCommentPost = asyncHandler(async (req, res) => {
	try {
		const post = await Post.findById(req.params.id)

		const comment = post.comments.find(
			comment => comment.id === req.params.comment_id
		)

		if (!comment) {
			return res
				.status(404)
				.json({ message: 'Comment does not exist,sorry mate!!' })
		}

		if (comment.user.toString() !== req.user.id) {
			return res.status(401).json({ message: 'User not authorized' })
		}

		post.comments = post.comments.filter(({ id }) => id !== req.params.comment_id)

		await post.save()

		return res.status(200).json(post.comments)
	} catch (error) {
		res.status(400).json({ message: `${error}`.red })
	}
})
