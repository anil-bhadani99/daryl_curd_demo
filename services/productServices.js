var { product } = require('../models/product')
var { customer } = require('../models/customer')
var aggregateHelper = require('../helpers/searchHelper')

exports.addProduct = async (data) => {
  try {
    var addProduct = await product(data)
    return await addProduct.save()
  } catch (err) {
    console.log('Error : ', err)
    return false
  }
}

exports.most_popular_product_by_city = async (city) => {
  try {
    const aggregateQuery = []
    aggregateQuery.push({ $match: { city: city } })

    aggregateQuery.push({
      $group: {
        _id: "$productId",
        count: { $sum: 1 }
      }
    })

    aggregateQuery.push({ $sort: { count: -1 } })

    aggregateQuery.push({ $limit: 1 })

    aggregateQuery.push(aggregateHelper.lookupHelper('product', '_id', '_id', 'productData'))

    aggregateQuery.push(aggregateHelper.unwindHelper('$productData'))

    aggregateQuery.push({
      $addFields: {
        most_sales_product: "$productData.name"
      }
    })

    aggregateQuery.push(aggregateHelper.projectHelper(['productData'], 0))

    const productData = await customer.aggregate(aggregateQuery).collation({ locale: 'en' })

    return productData[0]
  } catch (err) {
    console.log('Error : ', err)
    return false
  }
}

exports.most_popular_company_by_city = async (city) => {
  try {
    const aggregateQuery = []
    aggregateQuery.push({ $match: { city: city } })

    aggregateQuery.push(aggregateHelper.lookupHelper('product', 'productId', '_id', 'productData'))

    aggregateQuery.push(aggregateHelper.unwindHelper('$productData'))

    aggregateQuery.push({
      $addFields: {
        productName: "$productData.name",
        productCompanyId: "$productData.companyId"
      }
    })

    aggregateQuery.push(aggregateHelper.projectHelper(['productData'], 0))

    aggregateQuery.push({
      $group: {
        _id: "$productCompanyId",
        count: { $sum: 1 }
      }
    })

    aggregateQuery.push({ $sort: { count: -1 } })

    aggregateQuery.push({ $limit: 1 })


    aggregateQuery.push(aggregateHelper.lookupHelper('company', '_id', '_id', 'companyData'))

    aggregateQuery.push(aggregateHelper.unwindHelper('$companyData'))

    aggregateQuery.push({
      $addFields: {
        most_popular_company: "$companyData.name"
      }
    })

    aggregateQuery.push(aggregateHelper.projectHelper(['most_popular_company'], 1))

    const productData = await customer.aggregate(aggregateQuery).collation({ locale: 'en' })

    return productData[0]
  } catch (err) {
    console.log('Error : ', err)
    return false
  }
}

exports.most_sales_city_by_company = async (companyName) => {
  try {
    const aggregateQuery = []

    aggregateQuery.push(aggregateHelper.lookupHelper('product', 'productId', '_id', 'productData'))

    aggregateQuery.push(aggregateHelper.unwindHelper('$productData'))

    aggregateQuery.push({
      $addFields: {
        productCompanyId: "$productData.companyId"
      }
    })

    aggregateQuery.push(aggregateHelper.projectHelper(['productData'], 0))

    aggregateQuery.push(aggregateHelper.lookupHelper('company', 'productCompanyId', '_id', 'companyData'))

    aggregateQuery.push(aggregateHelper.unwindHelper('$companyData'))

    aggregateQuery.push({
      $addFields: {
        productCompanyName: "$companyData.name"
      }
    })

    aggregateQuery.push(aggregateHelper.projectHelper(['companyData'], 0))

    aggregateQuery.push({
      $match: {
        productCompanyName: companyName
      }
    })

    aggregateQuery.push({
      $group: {
        _id: "$city",
        count: { $sum: 1 }
      }
    })

    aggregateQuery.push({
      $addFields: {
        most_sales_city : "$_id"
      }
    })

    const productData = await customer.aggregate(aggregateQuery).collation({ locale: 'en' })

    return { most_sales_city : productData[0].most_sales_city}
  } catch (err) {
    console.log('Error : ', err)
    return false
  }
}

exports.get_customer_list_by_company = async (companyName) => {
  try {
    const aggregateQuery = []

    aggregateQuery.push(aggregateHelper.lookupHelper('product', 'productId', '_id', 'productData'))

    aggregateQuery.push(aggregateHelper.unwindHelper('$productData'))

    aggregateQuery.push({
      $addFields: {
        productCompanyId: "$productData.companyId"
      }
    })

    aggregateQuery.push(aggregateHelper.projectHelper(['productData'], 0))

    aggregateQuery.push(aggregateHelper.lookupHelper('company', 'productCompanyId', '_id', 'companyData'))

    aggregateQuery.push(aggregateHelper.unwindHelper('$companyData'))

    aggregateQuery.push({
      $addFields: {
        productCompanyName: "$companyData.name"
      }
    })

    aggregateQuery.push(aggregateHelper.projectHelper(['companyData'], 0))

    aggregateQuery.push({
      $match: {
        productCompanyName: companyName
      }
    })

    aggregateQuery.push(aggregateHelper.projectHelper(['productId','productCompanyId','productCompanyName'], 0))

    const productData = await customer.aggregate(aggregateQuery).collation({ locale: 'en' })

    return productData
  } catch (err) {
    console.log('Error : ', err)
    return false
  }
}

exports.get_bought_products_list_with_company_by_customer = async (customerName) => {
  try {
    const aggregateQuery = []

    aggregateQuery.push({ $match: { name: customerName } })

    aggregateQuery.push(aggregateHelper.lookupHelper('product', 'productId', '_id', 'productData'))

    aggregateQuery.push(aggregateHelper.unwindHelper('$productData'))

    aggregateQuery.push({
      $addFields: {
        productCompanyId: "$productData.companyId",
        productName : "$productData.name"
      }
    })

    aggregateQuery.push(aggregateHelper.projectHelper(['productData'], 0))

    aggregateQuery.push(aggregateHelper.lookupHelper('company', 'productCompanyId', '_id', 'companyData'))

    aggregateQuery.push(aggregateHelper.unwindHelper('$companyData'))

    aggregateQuery.push({
      $addFields: {
        company: "$companyData.name",
        product : "$productName",
      }
    })

    aggregateQuery.push(aggregateHelper.projectHelper(['companyData','name','city','companyData','productId','productCompanyId','__v','productName'], 0))

    const productData = await customer.aggregate(aggregateQuery).collation({ locale: 'en' })

    return productData
  } catch (err) {
    console.log('Error : ', err)
    return false
  }
}