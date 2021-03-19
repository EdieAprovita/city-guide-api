require('dotenv').config()

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const express = require('express')
const mongoose = require('mongoose')
const logger = require('morgan')
const path = require('path')
const colors = require('colors')
const cors = require('cors')
const session = require('express-session')

mongoose
	.connect(process.env.DB, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	})
	.then(x =>
		console.log(
			`Connected to Mongo! Database name: "${x.connections[0].name}"`.cyan.underline
				.bold
		)
	)
	.catch(err => console.error('Error connecting to mongo', err.red))

const app_name = require('./package.json').name
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`)

const app = express()

app.use(
	cors({
		credentials: true,
		origin: [process.env.FRONTENDPOINT],
	})
)

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json()).green
app.use(cookieParser()).green
app.use(logger('dev'))
//app.use(notFound)
//app.use(errorHandler)

const index = require('./routes/index')
app.use('/', index)

const recipe = require('./routes/recipe-routes')
app.use('/api/recipes', recipe)

const restaurant = require('./routes/restaurants-routes')
app.use('/api/restaurants', restaurant)

const user = require('./routes/auth-routes')
app.use('/api/users', user)

const market = require('./routes/markets-routes')
app.use('/api/markets', market)

const business = require('./routes/business-routes')
app.use('/api/businesses', business)

const doctor = require('./routes/doctor-routes')
app.use('/api/doctor', doctor)

//app.get('/*', (req, res) => res.sendFile(__dirname + '/public/index.html'))

module.exports = app
