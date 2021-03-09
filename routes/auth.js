var express = require('express')
var router = express.Router()

var userController = require('../controller/userController')

router.post('/login', userController.login)
router.post('/signUp', userController.signUp)

module.exports = router
