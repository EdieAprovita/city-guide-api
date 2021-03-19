const router = require('express').Router()

router.get('/', (req, res) => {
	try {
		res.status(200).json({ msg: 'API working!!' })
	} catch (error) {
		res.status(400).json({ message: `${error}` })
	}
})

module.exports = router
