const mongoose = require('mongoose')
const Scheme = mongoose.Schema

const News = mongoose.model('News', {
    url: {
        type: String,
        require: true,
        index: {
            unique: true
        }
    },
    title: {
        type: String,
        require: true
    },
    image: {
        type: String,
        require: true
    },
    dateTime: {
        type: Date,
        require: true,
        default: new Date()
    },
    description: {
        type: String,
        require: true
    }
})

module.exports = News