const mongoose = require("mongoose")
const schema = mongoose.Schema

const cart = new schema(
    {
        name:{type:String,required:true},
        category:{type:String,required:true},
        subcategory:{type:String,required:true},
        price:{type:String,required:true},
        description:{type:String,required:true},
        image:{type:String,required:true},
        productId:{type:mongoose.Schema.ObjectId,required:true},
        userId:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'users'},
        cartQuantity:{type:Number,required:true},
        total:{type:String,required:true},
        status:String
    }
)

module.exports = mongoose.model("cart",cart)