const mongoose = require("mongoose")

const picSchema = mongoose.Schema({
    name: String,
    img:
    {
        data: Buffer,
        contentType: String
    }
})

const pic = mongoose.model('Pic', picSchema)

module.exports = pic