const users = require('../models/usermodel')
const mongoose = require('mongoose')
const connectionstring = process.env.DBCONNECTIONSTRING
mongoose.connect(connectionstring).then(res=>{
    console.log("Bookstore database connected successfully");
    
}).catch(err=>{
    console.log("Database connection failed!!");
    console.log(err);
    
})