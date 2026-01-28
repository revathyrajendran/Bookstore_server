const applications = require('../models/applicationModel')


//add application done  by users
exports.addApplicationController = async(req,res)=>{
    console.log("Inside addApplicationController!! ");
    const {fullname,email, qualification,phone,coverletter,JobTitle,JobId } = req.body
    //since resume is a file , it is not involved in request body. As per schema , it is a required must field  some value will be there
    const resume = req.file.filename
    try{
        //only one job will be there from one location , eg: Hr for pune  and HR for Bihar. Location is important. Mnay users can apply for a  job and jobId is unique for a job
        const applicationDetail = await applications.findOne({email,JobId})
        if(applicationDetail){
            //conflict User has applied job already
            res.status(409).json("You Have Already Applied This Job !!!!!!")

        }else{
            //if user has not applied this job , he or she can apply this job
            const newApplication = new applications({
                fullname,email, qualification,phone,coverletter,resume,JobTitle,JobId
            })
            //store in db
           await   newApplication.save()
           res.status(200).json(newApplication)

        }


    }catch(err){
        res.status(500).json(err)
    }

    
}

//get application , applications applied by user for a job
exports.getApplicationController = async(req,res)=>{
    console.log("Inside getApplicationController!! ");
    
    try{
        //only one job will be there from one location , eg: Hr for pune  and HR for Bihar. Location is important. Mnay users can apply for a  job and jobId is unique for a job. This is for admin to see all applications
        const allApplications = await applications.find()
         res.status(200).json(allApplications)


    }catch(err){
        res.status(500).json(err)
    }

    
}

