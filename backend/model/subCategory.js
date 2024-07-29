const mongoose = require("mongoose")
const schema = mongoose.Schema

const subcategory = new schema(
    {
        name:String
    },
    { timestamps: true }
)

module.exports = mongoose.model("subcategory",subcategory)