import mongoose from 'mongoose'
import dotenv from 'dotenv'
import colors from 'colors'

import businesses from './data/businesses.js'
import doctors from './data/doctors.js'
import markets from './data/markets.js'
import recipes from './data/recipes.js'
import restaurants from './data/restaurants.js'

import Business from './models/Business.js'
import Doctor from './models/Doctor.js'
import Market from './models/Market.js'
import Recipe from './models/Recipe.js'
import Restaurant from './models/Restaurant.js'

dotenv.config()

const importData = async () => {
	try {
		const sampleBusinesses = businesses.map(business => {
			return { ...business }
		})

		await Business.insertMany(sampleBusinesses)

		const sampleDoctors = doctors.map(doctor => {
			return { ...doctor }
		})

		await Doctor.insertMany(sampleDoctors)

		const sampleMarkets = markets.map(market => {
			return { ...market }
		})

		await Market.insertMany(sampleMarkets)

		const sampleRecipes = recipes.map(recipe => {
			return { ...recipe }
		})

		await Recipe.insertMany(sampleRecipes)

		const sampleRestaurants = restaurants.map(restaurant => {
			return { ...restaurant }
		})

		await Restaurant.insertMany(sampleRestaurants)

		console.log('Data Imported'.green.inverse)
		process.exit()
	} catch (error) {
		console.error(`${error}`.red.inverse)
		process.exit(1)
	}
}

if (process.argv[2] === '-d') {
	importData()
}
