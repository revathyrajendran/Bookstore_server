//token verification . token us created using sign method in loginController
const jwt = require('jsonwebtoken')
//Middleware functions has 3 arguments req,res and next
const adminJwtMiddleware = (req,res,next)=>{
 console.log("Inside adminJwtMiddleware");
 //requests which need to verify token will be having its token in headers.
 const token = req.headers.authorization.split(" ")[1]
 console.log(token);
 try{
    const jwtResponse = jwt.verify(token,process.env.JWTSECRET)
    console.log(jwtResponse);
    req.payload = jwtResponse.userMail 
    req.roles = jwtResponse.roles
    if(jwtResponse.roles == "admin"){
        next()
    }else{
         res.status(401).json("Unauthorized User !!!!")
    }
 }catch(err){
    res.status(401).json("Invalid Token",err)
 }
 
 
}
module.exports = adminJwtMiddleware