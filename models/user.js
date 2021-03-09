const mongoose = require('mongoose')
var bcrypt = require('bcryptjs')

var userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            default: null
        },
        surname: {
            type: String,
            default: null
        },
        occupation: {
            type: String,
            default: null
        },
        email: {
            type: String,
            default: false
        },
        password: {
            type: String,
            required: true
        },
        userToken: {
            type: String,
            default: null
        },
        createdAt: {
            type: Date,
            default: Date.now()
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    {
        collection: 'user'
    }
)

userSchema.pre('save', async function (cb) {
    try {
        var user = this
        user.password = bcrypt.hashSync(this.password, 10)
        cb()
    } catch (error) {
        cb(error)
    }
})

var user = mongoose.model('user', userSchema)
module.exports.user = user
