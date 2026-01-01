//import models
const books = require('../models/bookmodel')
//users to sell book
exports.addBookController = async(req,res)=>{
    console.log("Inside Bookcontroller");
    //console.log(req.body);
    //Now to add book details into database , we need to destructure the request body.
    const {title,author,noOfPages,imageUrl,Price,discountPrice,abstract,publisher,language,isbn,category} = req.body
    //usermail was assigned to payload key in req object in jwtmiddleware
    const userMail = req.payload
    //console.log(req.files);
    //We do not need all details from the uploaded images, only unique file name is needed , image-1765430674412-oam (2).jpeg , it must hold names of 3 files, so it is set as an array.
    var uploadImg = []
    req.files.map(items=>uploadImg.push(items.filename))
    console.log(title,author,noOfPages,imageUrl,Price,discountPrice,abstract,publisher,language,isbn,category,uploadImg,userMail)
    try{
      const excistingBook= await books.findOne({title,userMail})
      //check if added book is there already in the collection
      if(excistingBook){
        res.status(401).json("You have already added the book")
      }else{
        const newBook = new books({
            title,author,noOfPages,imageUrl,Price,discountPrice,abstract,publisher,language,isbn,category,uploadImg,userMail
        })
        //save method to save in db
        await newBook.save()
        res.status(200).json(newBook)
      }
    }catch(err){
        res.status(500).json(err)
    }

    
    
}

//get home books - all looged in users can see , so no middleware here , no need of request here, only books from db must be shown.
exports.gethomebooks=async(req,res)=>{
  console.log("Inside gethomebooks Controller");
  try{
    //allbooks is a variable, users store books in the database under books in Bookstore, sort is used to arrange books, _id is unique value in mongo db, -1 to arrange books in descending order, limit is used here because we need only 4 books to be shown in the home page which can b seen as soon as the user loggs in.
    const allHomeBooks = await books.find().sort({_id:-1}).limit(4)
    res.status(200).json(allHomeBooks)

  }catch(err){
    res.status(500).json(err)
  }
  
}