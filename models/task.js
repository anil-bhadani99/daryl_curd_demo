const mongoose = require('mongoose')
var ObjectId = mongoose.Schema.Types.ObjectId

var taskSchema = new mongoose.Schema(
    {
        assignTo: { type: ObjectId, ref: 'user' },
        title: {
            type: String,
            default: null
        },
        description: {
            type: String,
            default: false
        },
        createdAt: {
            type: Date,
            default: Date.now()
        },
        assigndAt: {
            type: Date,
            default: null
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        isCompleted: {
            type: Boolean,
            default: false
        }
    },
    {
        collection: 'task'
    }
)
var task = mongoose.model('task', taskSchema)
module.exports.task = task
