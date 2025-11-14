const users = require('../models/usermodel')
//webstoken
const jwt = require('jsonwebtoken')
//exports because this file has multiple APIs
exports.registerController = async (req,res)=>{
    console.log("Inside request API");
    //set body to raw, you can see data type as JSON in postman
    //console.log(req.body);
    //since we parsed data there , we can deconstruct the data object here as
    const{username ,email,password} = req.body
     //console.log(username ,email,password);
     try{
        //to check if user is already excisting , then redirect to login 
        const excistingUser = await users.findOne({email})
        if(excistingUser){
            res.status(409).json("User Already excist ! Please login")
        }
        else{
            const newUser = users({
                username,
                email,
                password
            })
            await newUser.save()
            res.status(200).json(newUser) 
        }

     }catch(err){
           res.status(500).json(err)
     }
     
    
    res.status(200).send(`register request recieved`)
}
//Login 
exports.loginController = async(req,res)=>{
    console.log("Inside Login Api");
    //Object destructuring
    const {email,password } = req.body;
    console.log(email,password);
    try{
        const excistingUser = await users.findOne({email})
        if(excistingUser){
            if(excistingUser.password == password){
                //token, we have admin and user, so their mail is taken into consideration here 
                const token = jwt.sign({userMail:excistingUser.email},process.env.JWTSECRET)
                res.status(200).json({user:excistingUser,token})
            }else{
               res.status(401).json("Invalid email or password")
            }
        }else{
            res.status(404).json("Account Does not excist")
        }

    }catch(err){

        res.status(500).json(err)
    }
}

