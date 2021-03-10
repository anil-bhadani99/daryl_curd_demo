const responseHelper = require('../helpers/responseHelper')
var { addCompany, } = require('../services/companyServices')
var { required} = require('../helpers/validator')

exports.addCompany = async (req, res) => {
  try {
    if (await required(req.body.name)) return responseHelper.sendJsonResponse(req, res, 422, null, "Company name is required.", 'Error')
   
    const response = await addCompany(req.body)

    if (response) return responseHelper.sendJsonResponse(req, res, 200, response, 'Success', 'Success')

    return responseHelper.sendJsonResponse(req, res, 200, null, 'Error', 'Error')
  } catch (err) {
    console.log("Error: ",err)
    return responseHelper.sendJsonResponse(req, res, 500, null, err)
  }
}