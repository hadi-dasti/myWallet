const {body,validationResult}=require('express-validator')



// validation register Admin

exports.adminValidationRegister = [
    body('username').isString().notEmpty().isLength({min:6}).matches('^[a-zA-Z]+$').withMessage('نام باید انگلیسی و حداکث 8 حرف باشد!'),
    body('email').isString().trim().normalizeEmail().isEmail().notEmpty().withMessage('نام ایمیل را صحیح و با دقت بنویسید'),
    body('password').isString().isLength({min:8}).notEmpty().matches('^[0-9a-zA-Z]+$').withMessage('پسورد را با دقت وارد کنید'),
    body('phoneNumber').isString().isLength({min:11}).notEmpty().matches('^[0-9]').withMessage('شماره تلفن را وارد کنید'),
    body('role').isString().isIn(['MANAGEMENT', 'ADMIN']).notEmpty().withMessage('نقش  ادمین را حتما وارد کنید'),
    body('isActive').isBoolean().notEmpty().withMessage('بولی را وارد کنید'),
    body('isVerified').isBoolean().notEmpty().withMessage('بولی را وارد کنید')
]


// validation admin login
exports.adminValidationLogin = [
    body('email').isString().trim().normalizeEmail().isEmail().notEmpty().withMessage('نام ایمیل را صحیح و با دقت بنویسید'),
    body('password').isString().isLength({min:8}).notEmpty().matches('^[0-9a-zA-Z]+$').withMessage('پسورد را با دقت وارد کنید')
]


// validation Error
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
