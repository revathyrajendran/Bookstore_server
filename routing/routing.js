const express= require('express')
const router = express.Router()
const userController = require('../controller/usercontroller')
const bookController = require('../controller/bookController')
const jwtMiddleware = require('../middlewares/jwtMiddleware')
const multerConfig = require('../middlewares/imgMulterMiddleware')

//register
router.post('/register',userController.registerController)

//login
router.post('/login',userController.loginController)

//googlelogin
router.post('/google-login',userController.googleloginController)

//add book - multerConfig.array('uploadimges',3) , 3 is the max number oif images a user can upload for a book, uploadimges is in the req body.
router.post('/add-book',jwtMiddleware,multerConfig.array('uploadImges',3),bookController.addBookController)
module.exports = router

//get-home-books : middleware not needed, all users can see
router.get('/home-books',bookController.gethomebooksController)

//get-all-books : middleware needed, because only looged in user can access all-products page
router.get('/all-books',jwtMiddleware,bookController.getAllbooksController)

//view-book : middleware needed, because only looged in user can access single product page
router.get('/books/:id/view',jwtMiddleware,bookController.viewASingleBookController)