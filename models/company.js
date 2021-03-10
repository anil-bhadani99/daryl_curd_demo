const mongoose = require('mongoose')

var companySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            default: null
        },
        status: {
            type: String,
            default: 'active'
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    {
        collection: 'company'
    }
)

var company = mongoose.model('company', companySchema)
module.exports.company = company
