const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));


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