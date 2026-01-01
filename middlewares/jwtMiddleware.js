const jwt = require('jsonwebtoken')
const jwtMiddleware = (req,res,next)=>{
    console.log("Inside jwtmiddleware!");
    //control now moves from middleware to controller
    const token = req.headers.authorization.split(" ")[1]
    //output Bearer in index 0 and string in index 1 , eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTWFpbCI6Im1heG1pbGxlckBnbWFpbC5jb20iLCJpYXQiOjE3NjUzNTMzMTJ9.UBPP2NDpblglMyzd9mAYuSumMKkPWlcLCjCV4SgCqy0
    console.log(token);
    try{
      jwtResponse = jwt.verify(token,process.env.JWTSECRET)
      console.log(jwtResponse);
      //output : { userMail: 'maxmiller@gmail.com', iat: 1765353312 }
       //payload is just a variable name, it is not present in request, req and response are objects and we are assigning a key and value to that object.
     req.payload = jwtResponse.userMail
     console.log(req.payload);
     
      
      next()
    }
    catch(err){
       res.status(401).json("Invalid Token",err)
    }   
}
module.exports = jwtMiddleware