const mongoose = require("mongoose")
const schema = mongoose.Schema

const product = new schema(
    {
        name:{type:String,required:true},
        category:{type:String,required:true},
        subcategory:{type:String,required:true},
        item:{type:String,required:true},
        price:{type:String,required:true},
        quantity:{type:String,required:true},
        description:{type:String,required:true},
        image:{type:String,required:true},
    }
)

module.exports = mongoose.model("products",product)