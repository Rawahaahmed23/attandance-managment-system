const express = require('express')
const Routes = express.Router()
const main = require('../controller/adminController')
const adminMiddleware = require('../middleware/adminMiddleware')

const authMiddleware = require('../middleware/auth-middleware')




Routes.route('/users').get(authMiddleware,adminMiddleware, main.getuserstats)
Routes.route('/users/:id').get(authMiddleware,adminMiddleware,main.getUserById)



module.exports =Routes