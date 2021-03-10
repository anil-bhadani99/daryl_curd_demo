const responseHelper = require('../helpers/responseHelper')
var { addProduct, most_popular_product_by_city, most_popular_company_by_city, most_sales_city_by_company, get_customer_list_by_company,get_bought_products_list_with_company_by_customer } = require('../services/productServices')
var { required } = require('../helpers/validator')

exports.addProduct = async (req, res) => {
  try {
    if (await required(req.body.name)) return responseHelper.sendJsonResponse(req, res, 422, null, "Product name is required.", 'Error')

    const response = await addProduct(req.body)

    if (response) return responseHelper.sendJsonResponse(req, res, 200, response, 'Success', 'Success')

    return responseHelper.sendJsonResponse(req, res, 200, null, 'Error', 'Error')
  } catch (err) {
    console.log("Error: ", err)
    return responseHelper.sendJsonResponse(req, res, 500, null, err)
  }
}

exports.most_popular_product_by_city = async (req, res) => {
  try {
    // Check Valid id
    if (await required(req.query.city)) return responseHelper.sendJsonResponse(req, res, 422, null, 'City name is required.', 'Error')

    const most_popular_product_by_city_response = await most_popular_product_by_city(req.query.city)

    return responseHelper.sendJsonResponse(req, res, 200, most_popular_product_by_city_response, 'Success', 'Success')
  } catch (err) {
    console.log('err : ', err)
    await errorEmail(err, MESSAGE_DEV.CTRL_GET_PROMOCODE_DETAIL_BY_ID)
    return responseHelper.sendJsonResponse(req, res, 500, null, err)
  }
}

exports.most_popular_company_by_city = async (req, res) => {
  try {
    // Check Valid id
    if (await required(req.query.city)) return responseHelper.sendJsonResponse(req, res, 422, null, 'City name is required.', 'Error')

    const most_popular_company_by_city_response = await most_popular_company_by_city(req.query.city)

    return responseHelper.sendJsonResponse(req, res, 200, most_popular_company_by_city_response, 'Success', 'Success')
  } catch (err) {
    console.log('err : ', err)
    await errorEmail(err, MESSAGE_DEV.CTRL_GET_PROMOCODE_DETAIL_BY_ID)
    return responseHelper.sendJsonResponse(req, res, 500, null, err)
  }
}

exports.most_sales_city_by_company = async (req, res) => {
  try {
    // Check Valid id
    if (await required(req.query.companyName)) return responseHelper.sendJsonResponse(req, res, 422, null, 'Company name is required.', 'Error')

    const most_sales_city_by_company_response = await most_sales_city_by_company(req.query.companyName)

    return responseHelper.sendJsonResponse(req, res, 200, most_sales_city_by_company_response, 'Success', 'Success')
  } catch (err) {
    console.log('err : ', err)
    await errorEmail(err, MESSAGE_DEV.CTRL_GET_PROMOCODE_DETAIL_BY_ID)
    return responseHelper.sendJsonResponse(req, res, 500, null, err)
  }
}

exports.get_customer_list_by_companies = async (req, res) => {
  try {
    if (await req.query.companyName.length === 0) return responseHelper.sendJsonResponse(req, res, 422, null, 'Company name is required.', 'Error')

    const data = await get_customer_list(req.query.companyName)
   
    return responseHelper.sendJsonResponse(req, res, 200, data, 'Success', 'Success')
  } catch (err) {
    console.log('err : ', err)
    return responseHelper.sendJsonResponse(req, res, 500, null, err)
  }
}

async function get_customer_list(companies) {
  const customerLst = []

  for (const company of companies) {
    const most_sales_city_by_company_response = await get_customer_list_by_company(company);

    customerLst.push({
      company: company,
      total_customer: most_sales_city_by_company_response.length,
      list: most_sales_city_by_company_response
    })
  }
  return customerLst;
}

exports.get_bought_products_list_with_company_by_customer = async (req, res) => {
  try {
    if (await req.query.customerName.length === 0) return responseHelper.sendJsonResponse(req, res, 422, null, 'Customer name is required.', 'Error')

    const data = await get_customer_list_with_product(req.query.customerName)
   
    return responseHelper.sendJsonResponse(req, res, 200, data, 'Success', 'Success')
  } catch (err) {
    console.log('err : ', err)
    return responseHelper.sendJsonResponse(req, res, 500, null, err)
  }
}

async function get_customer_list_with_product(customers) {
  const customerLst = []

  for (const customer of customers) {
    const most_sales_city_by_company_response = await get_bought_products_list_with_company_by_customer(customer);

    customerLst.push({
      customer: customer,
      list: most_sales_city_by_company_response
    })
  }
  return customerLst;
}