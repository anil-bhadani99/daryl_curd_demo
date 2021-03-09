var express = require('express')
var router = express.Router()

var userController = require('../controller/userController')

router.post('/editUser', userController.editUser)
router.post('/deleteUser', userController.deleteUser)
router.get('/getAllUser', userController.getAllUser)

module.exports = router
