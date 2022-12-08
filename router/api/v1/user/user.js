const router = require('express').Router()
const {registerUser,loginUser,forgetPassword,restPassword} =require('../../../../controller/controllerUser/user')
const{registerValidationUser,loginValidationUser,validationReq} = require('../../../../validation/userValidate');
const uploadImage = require('../../../../upload/uploadImage');


// register user  and join on controller
router.post('/register',uploadImage.single('photo'),registerValidationUser,validationReq,registerUser)


// login user and join on controller
router.post('/login',loginValidationUser,validationReq,loginUser)


// create router forget password
router.post('/forget',forgetPassword)


//rest password
router.post('/rest',restPassword)



// Authentication Middleware
const authMiddleware = require('../../../../middleware/authUser')


// config on wallet Router
const walletUser = require('./wallet')
router.use('/wallet',authMiddleware,walletUser)


// config on order Router
const orderUser = require('./order')
router.use('/order',orderUser)

module.exports = router