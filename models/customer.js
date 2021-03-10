const mongoose = require('mongoose')
var ObjectId = mongoose.Schema.Types.ObjectId

var customerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            default: null
        },
        productId: { type: ObjectId, ref: 'product' },
        city: {
            type: String,
            default: null
        }
    },
    {
        collection: 'customer'
    }
)

var customer = mongoose.model('customer', customerSchema)
module.exports.customer = customer
