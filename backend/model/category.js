const mongoose = require("mongoose")
const schema = mongoose.Schema

const category = new schema(
    {
        category:{type:String,required:true},
        subcategory:[{type:mongoose.Schema.ObjectId,ref:'subcategory'}]
    }
)

module.exports = mongoose.model("category",category)