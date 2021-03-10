var { user } = require('../models/user')
var mongoose = require('mongoose')
var { setJwtToken } = require('../middleware/jwtAuth')
var bcrypt = require('bcryptjs')


exports.loginData = async (email, password) => {
  var response = {}
  var userData = await user
    .findOne({
      email: email
    })
    .lean()
  if (userData != null) {
    try {
      await bcrypt.compare(password, userData.password).then(async function (res, err) {
        if (res) {
          await setJwtToken(userData)
            .then(async function (token) {
              const userTemp = await user.findOneAndUpdate(
                {
                  email: email
                },
                {
                  userToken: token,
                },
                {
                  new: true
                }
              )
                .lean()

              response.status = 200
              response.message = "Success"
              delete userTemp.password
              response.data = userTemp
            })
            .catch((err) => {
              console.log(err)
              response.status = 400
              response.message = "Token not generated"
              response.data = {}
            })
        } else {
          response.status = 400
          response.message = 'Wrong Password'
          response.data = {}
        }
      })
    } catch (err) {
      console.log(err)
    }
    return response
  } else {
    response.status = 400
    response.message = "Email not register"
    response.data = {}
    return response
  }
}

exports.signUp = async (data) => {
  try {
    var userEmailData = await user.findOne({ email: data.email }).lean()

    if (userEmailData != null) {
      var response = {}
      response.status = 422
      response.message = "Email already exist!"
      return {response : response }
    }

    var signUp = await user(data)
    return await signUp.save()
  } catch (err) {
    console.log('Error : ', err)
    return false
  }
}

exports.deleteUser = async (id) => {
  try {
    const data = await user.updateOne({ _id: mongoose.Types.ObjectId(id) }, { isDeleted: true })
    if (data.nModified || data.ok) return true
    return false
  } catch (err) {
    console.log('Error : ', err)
    return false
  }
}

exports.editUser = async (condition, data) => {
  try {
    return await user.updateOne(condition, data)
  } catch (err) {
    console.log('err : ', err)
    return false
  }
}

exports.getAllUser = async () => {
  try {
    var response = {}
    const aggregateQuery = []

    aggregateQuery.push({
      $match: { isDeleted: false }
    })

    aggregateQuery.push({
      $project: { password: 0, userToken: 0 }
    })

    const userList = await user.aggregate(aggregateQuery).collation({ locale: 'en' })
    response.data = userList
    response.message = userList.length === 0 ? 'No user have been added yet' : 'Success'
    return response
  } catch (err) {
    console.log('Error : ', err)
    return false
  }
}