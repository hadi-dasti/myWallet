const router = require('express').Router()

// CONFIG ON CONTROLLER
const {createUserHomePage,createCommentHomePage,getAllComments,getOneUserHomePage,updateComments,updateUserHomePage,deleteHomePage,deleteCommentHomePage} = require('../../controller/publicPageController/userHomePage')
// VALIDATION
const {userHomePageValidation,commentUserValidation,paramHomePage,validationError} = require('../../validation/homePageValidate')



//create userHomePage and  comment and  like and unlike
//create userHomePage
router.post('/publicPage/userHomePage',userHomePageValidation,validationError,createUserHomePage)
//update user in publicPage
router.put('/homepage/:user',userHomePageValidation,validationError,updateUserHomePage)
// delete user in publicPage
router.delete('/homepage/delete/:user',paramHomePage,validationError,deleteHomePage)



// Authentication Middleware for comments
const AuthHomePageMiddleware = require('../../middleware/authUser')



//create comments with userId publicPage
router.post('/publicPage/:id/comments',commentUserValidation,validationError,createCommentHomePage)
// update comment on publicPage
router.put('/homepage/:id/commentUpdate',AuthHomePageMiddleware,commentUserValidation,validationError,updateComments)
//get all comments with userId by aggregate
router.get('/publicPage/allComment',AuthHomePageMiddleware,getAllComments)
// get one user publicPage with comment
router.get('/publicPage/:id',AuthHomePageMiddleware,getOneUserHomePage)
// delete user publicPage with comments
router.delete('/homepage/comment/:id',AuthHomePageMiddleware,paramHomePage,validationError,deleteCommentHomePage)





module.exports = router