var { company } = require('../models/company')

exports.addCompany = async (data) => {
  try {
    var addCompany = await company(data)
    return await addCompany.save()
  } catch (err) {
    console.log('Error : ', err)
    return false
  }
}