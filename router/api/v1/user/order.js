const router = require('express').Router()
const{orderWallet,getOrder,createUser,getUser} = require('../../../../controller/controllerUser/order')
const {registerValidationUser,validationOrder,validationParamOrder,validationParamWallet,validationReq} = require('../../../../validation/userValidate')



//create order with  walletId
router.post('/:walletId',validationOrder,validationParamWallet,validationReq,orderWallet) // create order with WalletId
router.get('/getOrder',getOrder)//get all order with $lookup
router.post('/createUser/:walletId/:orderId',registerValidationUser,validationParamWallet,validationParamOrder,validationReq,createUser) // create user with walletId and orderId
router.get('/getUser',getUser)// create user and join on wallet and order with lookup




module.exports = router