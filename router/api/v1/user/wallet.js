const router = require('express').Router()
const {createWallet,getWallet,createLookup,createOneWallet,updateWallet,deleteWallets} = require('../../../../controller/controllerUser/wallet')
const{validationBodyWallet,validationParamWallet,validationReq}=require('../../../../validation/userValidate')

// create wallet
router.post('/create',validationBodyWallet,validationReq,createWallet)
router.get('/create/walletOrder',getWallet) // create with populate
router.get('/lookup',createLookup) // create with lookup
router.get('/createOneWallet/:walletId',validationParamWallet,validationReq,createOneWallet)// create with populate
router.put('/editWallet/:walletId',validationBodyWallet,validationParamWallet,validationReq,updateWallet)// update wallet
router.delete('/deleteWallet/:walletId',validationParamWallet,validationReq,deleteWallets) //delete wallet


module.exports = router