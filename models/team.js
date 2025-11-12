const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://roxmarjuk25_db_user:HjofPsEfeeQZB7y3@cluster0.xr8jcdh.mongodb.net/?appName=Cluster0")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));


const teamModel = mongoose.Schema({

    name:String,
    title:String,
    id:{
    
        required: true,
        unique: true,
        type: Number,
        default: () => {
            // Random 6-digit number starting from 250000
            return 250000 + Math.floor(Math.random() * 10000); // 250000-259999
        }
    },
    sName:String,
    experience:String,
    facbook:String,
    whatsapp:{
      required: true,
        unique: true,
        type: Number,
    },
    massenger:String,
    img:String
})
module.exports = mongoose.model("member" , teamModel)