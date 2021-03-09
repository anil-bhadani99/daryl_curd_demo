const mongoose = require('mongoose')
const responseHelper = require('../helpers/responseHelper')
var { signUp, deleteUser, editUser, getAllUser, loginData } = require('../services/userServices')
const { ObjectId } = mongoose.Types
var { required, isValidEmail ,isStrongPassword, validID} = require('../helpers/validator')

exports.login = async (req, res) => {
  try {
    if (await required(req.body.email)) return responseHelper.sendJsonResponse(req, res, 422, null, "Email is required.", 'Error')
    if (await isValidEmail(req.body.email)) return responseHelper.sendJsonResponse(req, res, 422, null, "Valid Email is required.", 'Error')
    if (await required(req.body.password)) return responseHelper.sendJsonResponse(req, res, 422, null, "Password is required.", 'Error')

    var email = req.body.email.trim()
    var password = req.body.password
    const response = await loginData(email, password)
    return responseHelper.sendJsonResponse(req, res, response.status, response.data, response.message, response.statusMessage)
  } catch (err) {
    console.log(err)
    return responseHelper.sendJsonResponse(req, res, 500, null, 'Error')
  }
}

exports.signUp = async (req, res) => {
  try {
    if (await required(req.body.name)) return responseHelper.sendJsonResponse(req, res, 422, null, "Name is required.", 'Error')
    if (await required(req.body.surname)) return responseHelper.sendJsonResponse(req, res, 422, null, "Surname is required.", 'Error')
    if (await required(req.body.occupation)) return responseHelper.sendJsonResponse(req, res, 422, null, "Occupation is required.", 'Error')
    if (await required(req.body.email)) return responseHelper.sendJsonResponse(req, res, 422, null, "Email is required.", 'Error')
    if (await isValidEmail(req.body.email)) return responseHelper.sendJsonResponse(req, res, 422, null, "Valid Email is required.", 'Error')
    if (await required(req.body.password)) return responseHelper.sendJsonResponse(req, res, 422, null, "Password is required.", 'Error')
    if (await isStrongPassword(req.body.password)) return responseHelper.sendJsonResponse(req, res, 422, null, "Password is required Capital Letter, Number, Special Character, Minimum length is 8.", 'Error')
    
    const response = await signUp(req.body)

    if(response.status && response.status === status) return responseHelper.sendJsonResponse(req, res, 422, null, response.message, 'Error')

    if (response) return responseHelper.sendJsonResponse(req, res, 200, response, 'Success', 'Success')

    return responseHelper.sendJsonResponse(req, res, 200, null, 'Error', 'Error')
  } catch (err) {
    console.log("Error: ",err)
    return responseHelper.sendJsonResponse(req, res, 500, null, err)
  }
}

exports.deleteUser = async (req, res) => {
  try {
    if (await required(req.body.id)) return responseHelper.sendJsonResponse(req, res, 422, null,"ID is requried.", "Error")
    if (await validID(req.body.id)) return responseHelper.sendJsonResponse(req, res, 422, null, "Valid Id is requried.", "Error")
   
    const response = await deleteUser(req.body.id)

    if (response) return responseHelper.sendJsonResponse(req, res, 200, response.data, 'User deleted successfully.', 'Success')

    return responseHelper.sendJsonResponse(req, res, 200, null, 'Error', 'Error')
  } catch (err) {
    console.log('error : ', err)
    return responseHelper.sendJsonResponse(req, res, 500, null, err)
  }
}

exports.editUser = async (req, res) => {
  try {
    if (await required(req.body.id)) return responseHelper.sendJsonResponse(req, res, 422, null,"ID is requried.", "Error")
    if (await validID(req.body.id)) return responseHelper.sendJsonResponse(req, res, 422, null, "Valid Id is requried.", "Error")
    if (await required(req.body.name)) return responseHelper.sendJsonResponse(req, res, 422, null, "Name is required.", 'Error')
    if (await required(req.body.surname)) return responseHelper.sendJsonResponse(req, res, 422, null, "Surname is required.", 'Error')
    if (await required(req.body.occupation)) return responseHelper.sendJsonResponse(req, res, 422, null, "Occupation is required.", 'Error')
    if (await required(req.body.email)) return responseHelper.sendJsonResponse(req, res, 422, null, "Email is required.", 'Error')
    if (await isValidEmail(req.body.email)) return responseHelper.sendJsonResponse(req, res, 422, null, "Valid Email is required.", 'Error')
    if (await required(req.body.password)) return responseHelper.sendJsonResponse(req, res, 422, null, "Password is required.", 'Error')
    if (await isStrongPassword(req.body.password)) return responseHelper.sendJsonResponse(req, res, 422, null, "Password is required Capital Letter, Number, Special Character, Minimum length is 8.", 'Error')
  

    const condition = { _id: ObjectId(req.body.id) }
    const updatedData = {
      name: req.body.name,
      surname: req.body.surname,
      occupation: req.body.occupation,
      email: req.body.email,
      password: req.body.password,
      isDeleted: req.body.isDeleted || false,
    }

    const response = await editUser(condition, updatedData)

    if (response) return responseHelper.sendJsonResponse(req, res, 200, null, 'User update successfully', 'Success')
    return responseHelper.sendJsonResponse(req, res, 500, null, 'Error', 'Error')
  } catch (err) {
    console.log("error : ",err)
    return responseHelper.sendJsonResponse(req, res, 500, null, err)
  }
}

exports.getAllUser = async (req, res) => {
  try {
    const response = await getAllUser()
    if (response) return responseHelper.sendJsonResponse(req, res, 200, response.data, 'Success', 'Success',)

    return responseHelper.sendJsonResponse(req, res, 400, null, 'Error', 'Error')
  } catch (err) {
    return responseHelper.sendJsonResponse(req, res, 500, null, err)
  }
}