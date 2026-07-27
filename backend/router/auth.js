const express = require('express')
const Route = express.Router()
const main = require('../controller/index')

const authMiddleware = require('../middleware/auth-middleware')
const {signupSchema,loginSchema} = require('../validator/errorSchema')
const validator = require('../middleware/validatemiddlware')





Route.route('/register').post(validator(signupSchema),main.register)
Route.route('/login').post(validator(loginSchema),main.login)
Route.route('/cheakout').post(authMiddleware,main.cheakout)
Route.route('/cheakin').post(authMiddleware,main.checkIn)
Route.route('/user').get(authMiddleware,main.user)




module.exports = Route