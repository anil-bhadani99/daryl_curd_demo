var express = require('express')
var router = express.Router()

var userController = require('../controller/userController')
var companyController = require('../controller/companyController')
var productController = require('../controller/productController')
var customerController = require('../controller/customerController')

router.post('/login', userController.login)
router.post('/signUp', userController.signUp)


// Company APIs
router.post('/addCompany', companyController.addCompany)

// Product APIs
router.post('/addProduct', productController.addProduct)
router.get('/most_popular_product_by_city', productController.most_popular_product_by_city)
router.get('/most_popular_company_by_city', productController.most_popular_company_by_city)
router.get('/most_sales_city_by_company', productController.most_sales_city_by_company)
router.get('/get_customer_list_by_companies', productController.get_customer_list_by_companies)
router.get('/get_bought_products_list_with_company_by_customer', productController.get_bought_products_list_with_company_by_customer)


// Customer APIs
router.post('/addCustomer', customerController.addCustomer)

module.exports = router
