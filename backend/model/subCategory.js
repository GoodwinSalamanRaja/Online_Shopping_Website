const mongoose = require("mongoose")
const schema = mongoose.Schema

const subcategory = new schema(
    {
        name:String
    }
)

module.exports = mongoose.model("subcategory",subcategory)