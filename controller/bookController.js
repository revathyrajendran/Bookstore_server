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
exports.gethomebooksController=async(req,res)=>{
  console.log("Inside gethomebooks Controller");
  try{
    //allbooks is a variable, users store books in the database under books in Bookstore, sort is used to arrange books, _id is unique value in mongo db, -1 to arrange books in descending order, limit is used here because we need only 4 books to be shown in the home page which can b seen as soon as the user loggs in.
    const allHomeBooks = await books.find().sort({_id:-1}).limit(4)
    res.status(200).json(allHomeBooks)

  }catch(err){
    res.status(500).json(err)
  }
  
}

//get all  books , called by all-products, to see uploaded books for a logged in user, when You click Books from navuigation menu in the header
exports.getAllbooksController=async(req,res)=>{
  console.log("Inside getAllbooks Controller");
  //for search in All products page, we get query parameter which is a key value pair from queries in the request. search is a key defined by us  eg: https://www.google.com/search?q=javascript+basics&rlz=1C1VDKB_enIN927IN927&oq=javascript+basics&gs_lcrp=EgZjaHJvbWUyDwgAEE. search should also be the same in the frontend.
 const searchKey = req.query.search
  //usermail was assigned to payload key in req object in jwtmiddleware
    const emailofuser = req.payload
    const query ={
      //regex is for comparison, options value i means it is case insensitivity
      title:{$regex : searchKey,$options :'i'},
      //you can see book if only it was not uploaded by that user, that is why email is used here
      userMail:{$ne:emailofuser}
    }
  try{
    //allbooks is a variable, users store books in the database under books in Bookstore, sort is used to arrange books, _id is unique value in mongo db, -1 to arrange books in descending order, limit is used here because we need only 4 books to be shown in the home page which can b seen as soon as the user loggs in. And the suer should not see the book he or she has uploaded.
    //here, in books collection . if userMail field value, is not equal to input mail
    const allBooks = await books.find(query)
    res.status(200).json(allBooks)

  }catch(err){
    res.status(500).json(err)
  }
  
}

//View A particular Book
exports.viewASingleBookController=async(req,res)=>{
  console.log("Inside viewASingleBookController ");
  //to get id of a particular project
   const {id} = req.params 
   console.log(id);
   try{
    //_id is unique in mongo db , findOne() can also be used 
    const viewBook = await books.findById({_id:id})
    res.status(200).json(viewBook)

   }
   catch(err){
    res.status(500).json(err)
   }
   
}

//get all user books, books uploaded or sold by users by the logged in user , whether they are approved or rejected by the admin or for bookstatus
exports.getAllUserBooks=async(req,res)=>{
  console.log("Inside getAllUserBooks");
  const emailofuser = req.payload
  try{
    const alluserbooks = await books.find({userMail:emailofuser})
      res.status(200).json(alluserbooks)
  }catch(err){
    res.status(500).json(err)
  } 
}

//get all user bought books, books baought by a user from the website which were uploaded by other user,piurchase history
exports.getAllUserBoughtBooks=async(req,res)=>{
  console.log("Inside getAllUserBoughtBooks");
  const emailofuser = req.payload
  try{
    //bought was declared in schema, which was empty initially
    const alluserboughtbooks = await books.find({bought:emailofuser})
      res.status(200).json(alluserboughtbooks)
  }catch(err){
    res.status(500).json(err)
  }
}

//removing the book sold by the user from book status
exports.deleteUserUploadedBook = async(req,res)=>{
  console.log("Inside deleteUserUploadedBook");
  //book id
  const {id} = req.params
  console.log(id);
  try{
    await books.findByIdAndDelete({_id:id})
    res.status(200).json("Book Deleted Successfully!!!")

  }catch(err){
    res.status(500).json(err)
  }
  
  
}

//-------admin-----------

//get all books list in resourceadmin page, Here no body and no header bcoz however admin cannot upload books, but in case of users, admin himself is a user, so we should make sure that admin who makes the request is not included in users list 
exports.getAllBooksListForAdminController = async(req,res)=>{
  console.log("Inside getAllBooksListForAdminController ");
  try{
    const allAdminBooks =  await books.find()
    res.status(200).json(allAdminBooks)

  }catch(err){
    res.status(500).json(err)
  }

}
