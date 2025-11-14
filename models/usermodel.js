const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required :true
    },
    email:{
        type:String,
        required :true
    },
    password:{
        type:String,
        required :true
    },
    profile:{
        type:String,
        default :""
    },
    bio:{
         type:String,
        default :"Bookstore user"
    },
     roles:{
        type:String,
        default :"user"
    }
})
const users = mongoose.model("users",userSchema)
module.exports = users