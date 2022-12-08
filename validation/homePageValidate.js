const {body ,param, validationResult } = require('express-validator')



// VALIDATION USER HOMEPAGE
exports.userHomePageValidation = [
    body('nickName')
        .notEmpty()
        .exists()
        .isLength({min :3})
        .withMessage('نام خود را وارد کنید'),
    body('TelMobile')
        .notEmpty()
        .exists()
        .isNumeric()
        .isLength({min : 11})
        .withMessage('شماره تلفن را وارد کنید')
]

// VALIDATION COMMENT HOMEPAGE
exports.commentUserValidation = [
    param('id')
        .isMongoId()
        .not()
        .withMessage('شناسه شخص را صحیح وارد کنید'),
    body('textComments')
        .notEmpty()
        .trim()
        .withMessage('پیام خود را بنویسید'),
    body('isApproved')
        .notEmpty()
        .isBoolean()
        .withMessage('مربوط به مدیریت در کامنت میباشد')
]

// VALIDATION PARAM IN HOMEPAGE
exports.paramHomePage = [
    param('user')
        .isMongoId()
        .withMessage('شناسه شخص را صحیح وارد کنید')
]

// VALIDATION ERROR
exports.validationError = (req,res,next)=>{

    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return  res.status(400).json({
            success : false,
            msg : errors.array()
        })
    }

    return next()
}