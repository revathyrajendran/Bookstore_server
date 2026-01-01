const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    noOfPages:{
        type:Number,
        required:true
    },
   imageUrl:{
        type:String,
        required:true
    },
    Price:{
        type:Number,
        required:true
    },
    discountPrice:{
        type:Number,
        required:true
    },
    abstract:{
        type:String,
        required:true
    },
    publisher:{
        type:String,
        required:true
    },
    language:{
        type:String,
        required:true
    },
    isbn:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    //for more than one image
    uploadImg:{
        type:Array,
        required:true
    },
    status:{
        type:String,
        default:'Pending'
    },
    userMail:{
        type:String,
        required:true
    },
    //purchase history of logged in
    bought:{
        type:String,
       default:''
    }
})
// model variable must be plural
const books = mongoose.model("books",bookSchema)
module.exports = books