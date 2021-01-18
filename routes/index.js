const router = require('express').Router();

router.get('/', (req, res, next) => {
  try {
    res.status(200).json({ msg: 'Working' });
  } catch (error) {
    res.status(400).json({ message: `${error}` });
  }
});

module.exports = router;
