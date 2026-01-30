const express= require('express')
const router = express.Router()
const userController = require('../controller/usercontroller')
const bookController = require('../controller/bookController')
const jwtMiddleware = require('../middlewares/jwtMiddleware')
const multerConfig = require('../middlewares/imgMulterMiddleware')
const adminJwtMiddleware = require('../middlewares/aminJwtMiddleware')
const jobController = require('../controller/jobController')
const pdfmulterConfig = require('../middlewares/pdfMulterMiddleware')
const applicationController = require('../controller/applicationController')


//register
router.post('/register',userController.registerController)

//login
router.post('/login',userController.loginController)

//googlelogin
router.post('/google-login',userController.googleloginController)

//add book - multerConfig.array('uploadimges',3) , 3 is the max number oif images a user can upload for a book, uploadimges is in the req body.
router.post('/add-book',jwtMiddleware,multerConfig.array('uploadImges',3),bookController.addBookController)


//get-home-books : middleware not needed, all users can see
router.get('/home-books',bookController.gethomebooksController)

//get-all-books : middleware needed, because only looged in user can access all-products page
router.get('/all-books',jwtMiddleware,bookController.getAllbooksController)

//view-book : middleware needed, because only looged in user can access single product page
router.get('/books/:id/view',jwtMiddleware,bookController.viewASingleBookController)

//get all user sold books, Bookstatus
router.get('/user-books',jwtMiddleware,bookController.getAllUserBooks)

//get all user bought books, Purchase history
router.get('/user-bought-books',jwtMiddleware,bookController.getAllUserBoughtBooks)

//delete books uploaded by user, from Bookstatus
router.delete('/user-books/:id/remove',jwtMiddleware,bookController.deleteUserUploadedBook)

//to change profile of a loggedin user,token is needed. multerConfig uses single() method here, beacause it uses only one photo here
router.put('/user-profile/edit',jwtMiddleware,multerConfig.single('profile'),userController.loggedinuserprofileditController)

//user applying for a job: add-application, users submit their resume , so pdfmulterConfig. single is the method and resume is field.
router.post('/user-application/add',jwtMiddleware,pdfmulterConfig.single('resume'),applicationController.addApplicationController)

//user making payment
router.post('/make-payment',jwtMiddleware,bookController.makeBookPaymentController)

//------------------admin--------------------------------------

// 1) To get all user or user list. But here jwtMiddleware cannot be sued, because not just user or admin, but role has to be checked, so we created adminJwtMiddleware.
router.get('/all-users',adminJwtMiddleware,userController.getAllusersForAdminController)
router.get('/all-books-admin',adminJwtMiddleware,bookController.getAllBooksListForAdminController)
//admin to approve books
router.put('/admin/book/approve',adminJwtMiddleware,bookController.updateUserBookStatus)
//admin profile update,can also edit profile so multer is also used
router.put('/admin-edit/profile',adminJwtMiddleware,multerConfig.single('profile'),userController.adminProfileEditController)
//job to be added by admin
router.post('/admin-add-job',adminJwtMiddleware,jobController.addJobController)
//to see all jobs uploaded by admin : unauthorized user , can be seen without logging in
router.get('/all-jobs',jobController.getAllUploadedJobsForAdminController)
//delete a job bu admin : authorized user
router.delete('/job/:id/remove',adminJwtMiddleware,jobController.removeJobControllerByAdmin)
//admin to get all applications applied by the users for a job: get user applications , users submit their resume , so pdfmulterConfig. single is the method and resume is field.
router.get('/all-applications/admin',adminJwtMiddleware,applicationController.getApplicationController)


module.exports = router
