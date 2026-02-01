const jobs = require('../models/jobModel')

//add job
exports.addJobController = async(req,res)=>{
    console.log("Inside addJobController! ");
    //destructuring request body with keys from schema
    const { title,location,type,salary, qualification,experience,description} = req.body

    try{
        //in db if there is any job with same title and location is checked
        const jobDetails = await jobs.findOne({title,location})

        //if such a job description already excist with same title and location
        if(jobDetails){
            res.status(409).json("Job is already added. Please Add Another Job!")

        } 
           //if no job with title and location is there in db, then it is added to db.
        else{ 
            // adding a non excisting job to db
            const newJob = new jobs({
                title,location,type,salary, qualification,experience,description
            })
            await newJob.save()
            res.status(200).json(newJob)


        }

    }catch(err){
        res.status(500).json(err)
    }
    

}

//get all jobs: uploaded by admin, for admin  and users
exports.getAllUploadedJobsForAdminController = async(req,res)=>{
    console.log("Inside getAllUploadedJobsForAdminController ");
    //from search key of url, we get searchkey . req.query is an object in Express.js that contains data sent through the URL as query parameters.
//When you send a request like /jobs?location=Kochi&type=fulltime, Express stores { location: "Kochi", type: "fulltime" } inside req.query.
//It is mainly used in GET requests to filter or search data.
//Unlike req.body, req.query does not require body-parser middleware.
//You can access values using req.query.parameterName.
    const jobSearchKey = req.query.search
    //creating query for search by title.
    const query={
        //$regex is used to search for text patterns, and $options: "i" makes the search case-insensitive.
            title:{$regex: jobSearchKey,$options:"i"}
    }
    try{
        //to see every jobs altogether , find is used.
        const allJobsToSee = await jobs.find(query)
        res.status(200).json(allJobsToSee)

    }catch(err){
        res.status(500).json(err)
    }
    

}

//delete a job : 6967da05dde4168e2a0a184d : only done by authorized admin
exports.removeJobControllerByAdmin=async(req,res)=>{
    console.log("Inside removeJobControllerByAdmin ");
    //we need to get id of the job to be deleted, so here we use params
    const {id} = req.params
    try{
        const deleteJob = await jobs.findByIdAndDelete({_id:id})
        res.status(200).json(deleteJob)

    }catch(err){
        res.status(500).json(err)
    }
    
}