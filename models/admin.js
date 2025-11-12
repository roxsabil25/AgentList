const mongoose = require("mongoose");




const adminModel = mongoose.Schema({
    name:String,
    number:Number,
    pass:String

})
module.exports = mongoose.model("admin" , adminModel)