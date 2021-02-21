const router = require('express').Router()
const protect = require('../middleware/authMiddleware')

const {
	createPost,
	getAllPosts,
	getPostById,
	deletePostById,
	likePost,
	unlikePost,
	commentPost,
	deleteCommentPost,
} = require('../controllers/post')

router.get('/all', (protect, getAllPosts))
router.get('/:id', (protect, getPostById))
router.post('/create', (protect, createPost))
router.post('/comment/:id', (protect, commentPost))
router.put('/like/:id', (protect, likePost))
router.put('/unlike/:id', (protect, unlikePost))
router.delete('/:id', (protect, deletePostById))
router.delete('/comment/:id/:comment_id', (protect, deleteCommentPost))

module.exports = router
