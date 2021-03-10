const mongoose = require('mongoose')
var ObjectId = mongoose.Schema.Types.ObjectId

var productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            default: null
        },
        companyId: { type: ObjectId, ref: 'company' },
        price: {
            type: String,
            default: 'active'
        }
    },
    {
        collection: 'product'
    }
)

var product = mongoose.model('product', productSchema)
module.exports.product = product
