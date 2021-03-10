const responseHelper = require('../helpers/responseHelper')
var { addCustomer } = require('../services/customerServices')
var { required} = require('../helpers/validator')

exports.addCustomer = async (req, res) => {
  try {
    if (await required(req.body.name)) return responseHelper.sendJsonResponse(req, res, 422, null, "Customer name is required.", 'Error')
   
    const response = await addCustomer(req.body)

    if(response.status && response.status === status) return responseHelper.sendJsonResponse(req, res, 422, null, response.message, 'Error')

    if (response) return responseHelper.sendJsonResponse(req, res, 200, response, 'Success', 'Success')

    return responseHelper.sendJsonResponse(req, res, 200, null, 'Error', 'Error')
  } catch (err) {
    console.log("Error: ",err)
    return responseHelper.sendJsonResponse(req, res, 500, null, err)
  }
}