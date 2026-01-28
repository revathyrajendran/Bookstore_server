const multer = require('multer')

//defining storage location using diskstorage method of multer library
const storage = multer.diskStorage({
    //destination is the predefined key that defines the location of file storage using an arrow fn with three arguments namely req,file,callback to make it look async.
    destination : (req,file,cb)=>{
        //null means error is not defined, second value is the location. './' means parent folder.
        cb(null,'./pdf')
    },
    //this is to avaod adding of files having same name .
    filename : (req,file,cb)=>{
        //Date.now to get a unique identity eg: image-1765430674412-oam (2).jpeg'
        cb(null,`resume-${Date.now()}-${file.originalname}`)
    }
})
//filefilter is used to check type of file being uploaded
const fileFilter = (req,file,cb)=>{
    //img with png, jpg, jpeg
    //mimetype decides the file type
    if(file.mimetype=='application/pdf' ){
        //only files with true conditions will be stored
         cb(null,true)
    }else{
         cb(null,false)
         //can be seen in terminal in vs code , not in front end
         return cb(new Error("Accept only pdf file!"))
    }
}

const pdfmulterConfig = multer({
    storage,
    fileFilter
})
module.exports = pdfmulterConfig