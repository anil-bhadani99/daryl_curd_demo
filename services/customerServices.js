var { customer } = require('../models/customer')

exports.addCustomer = async (data) => {
  try {
    var addCustomer = await customer(data)
    return await addCustomer.save()
  } catch (err) {
    console.log('Error : ', err)
    return false
  }
}