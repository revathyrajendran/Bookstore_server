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
                //token, we have admin and user, so their mail is taken into consideration here.role is  used here to identify users and admin separately.Now token will be having mail and role. 

                const token = jwt.sign({userMail:excistingUser.email,roles:excistingUser.roles},process.env.JWTSECRET)
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

//googlelogin
exports.googleloginController = async(req,res)=>{
    console.log("Inside Googlelogin Api");
    //Object destructuring
    const {email,password,username,profile } = req.body;
    console.log(email,password,username,profile);
    try{
        const excistingUser = await users.findOne({email})
        if(excistingUser){
            //token, we have admin and user, so their mail is taken into consideration here ,password not needed because logged in using google. role is  used here to identify users and admin separately.Now token will be having mail and role. 
                const token = jwt.sign({userMail:excistingUser.email,role:excistingUser.roles},process.env.JWTSECRET)
                res.status(200).json({user:excistingUser,token})
        }else{
           const newUser = new users({
            username,email,password,profile
           }) 
           //Mongodb saving
           await newUser.save()
            //token, we have admin and user, so their mail is taken into consideration here ,
                const token = jwt.sign({userMail:newUser.email},process.env.JWTSECRET)
                res.status(200).json({user:newUser,token})
        }

    }catch(err){

        res.status(500).json(err)
    }
}

//logged in user profile changing
exports.loggedinuserprofileditController= async(req,res)=>{
    console.log("Inside loggedinuserprofileditController ");
    //text type contents are present in req body, these below keys are same as in usermodel
    const {username,password,bio,roles,profile}=req.body
    //payload in jwt middleware
    const email = req.payload
    //profile, here file because single picture only. If the user has no profile, it will be present here as a text. If user has profile it will be i the file as filename.
    const loggedInUserDPupdate = req.file?req.file.filename:profile

    try{
        //parameter using which the particular data has to be found, then update needed data
        const updateuser = await users.findOneAndUpdate({email},{username,password,profile:loggedInUserDPupdate,bio,roles},{new:true})
        updateuser.save()
        res.status(200).json(updateuser)
    }catch(err){
        res.status(500).json(err)
    }

    
}

//------admin-----------

//get all uwers for admin , in case of users, admin himself is a user, so we should make sure that admin who makes the request is not included in users list 
exports.getAllusersForAdminController = async(req,res)=>{
    console.log("Inside getAllusersForAdminController ");
    const adminEmail = req.payload
    try{
        //email in db
        const allusers = await users.find({email:{$ne:adminEmail}})
        res.status(200).json(allusers)

    }catch(err){
        res.status(500).json(err)
    }

    
}

//admin profile editing
exports.adminProfileEditController=async(req,res)=>{
    console.log("Inside adminProfileEditController ");
    const{username,password,bio,profile}=req.body
    const email = req.payload
    const roles = req.roles
    const uploadProfile = req.file?req.file.filename:profile
    try{
        const updateUser = await users.findOneAndUpdate({email},{username,email,password,profile:uploadProfile,bio,roles},{new:true})
        await updateUser.save()
        res.status(200).json(updateUser)

    }catch(err){
        res.status(500).json(err)
    }
    
}

