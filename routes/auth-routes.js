const express = require('express')
const authroutes = express.Router()

const { signup, login, logout, currentUser } = require('../controllers/auth')

authroutes.post('/login', login)
authroutes.post('/signup', signup)
authroutes.get('/current-user', currentUser)
authroutes.get('/logout', logout)

module.exports = authroutes
