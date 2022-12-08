const router = require('express').Router()

// config controller
const {registerAdmin,loginAdmin,testAdmin} = require('../../controller/adminController/admin')
// config validation
const {adminValidationRegister,adminValidationLogin,validationError} = require('../../validation/adminValidate')
// authorization middleware
const authPageAdmin = require('../../middleware/AuthoAdmin')
//authentication Admin
const authAdmin = require('../../middleware/authAdmin')


// register Admin Api
router.post('/register',adminValidationRegister,validationError,registerAdmin)
// login Admin Api
router.post('/login',adminValidationLogin,validationError,loginAdmin)

router.get('/get/admin',authAdmin,authPageAdmin(['MANAGEMENT']),testAdmin)


module.exports = router