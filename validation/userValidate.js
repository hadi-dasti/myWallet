const {body,param, validationResult } = require('express-validator')

// validation register user
exports.registerValidationUser = [
    body('firstName')
        .not()
        .isEmpty()
        .withMessage('نام کوچک نمیتواند خالی بماند'),
    body('lastName')
        .not()
        .isEmpty()
        .withMessage('نام فامیل نمیتواند خالی بماند'),
    body('email')
        .not()
        .isEmpty()
        .isEmail()
        .normalizeEmail()
        .withMessage('ایمیل را وارد کنید'),
    body('password')
        .notEmpty()
        .isLength({min : 6})
        .withMessage('پسورد را وارد کنید'),
    body('phoneNumber')
        .not()
        .isEmpty()
        .isLength({min :8})
        .trim()
        .withMessage('شماره تلفن را وارد کنید'),
    body('nationalCode')
        .notEmpty()
        .isLength({min:8})
        .withMessage('کد ملی را وارد کنید'),
    body('gender')
        .notEmpty()
        .isIn(['MALE','FEMALE'])
        .withMessage('جنسیت را وارد کنید')
]

// validation user login
exports.loginValidationUser = [
    body('nationalCode')
        .notEmpty()
        .isLength({min:8})
        .withMessage('کد ملی را وارد کنید'),
    body('password')
        .notEmpty()
        .isLength({min : 6})
        .withMessage('پسورد را وارد کنید'),

]

// validation wallet
exports.validationBodyWallet = [
    body('statusWallet')
        .notEmpty()
        .isLength({min:5})
        .exists()
        .withMessage('نام کیف پول را وارد کنید'),

    body('walletName')
        .not()
        .isEmpty()
        .trim()
        .withMessage('نام کیف پول را وارد کنید')
]

// validation orderWallet
exports.validationOrder = [
    body('orderCompany')
        .not()
        .isEmpty()
        .isLength({min : 4})
        .withMessage('نام سفارش دهنده را وارد کنید'),
    body('orderWallet')
        .notEmpty()
        .isIn(['Digital currency','Currency paper'])
        .withMessage('محصول سفارش را وارد کنید')
]

// validationParamWallet
exports.validationParamWallet = [
    param('walletId')
        .notEmpty()
        .exists()
        .isMongoId()
        .withMessage('شناسه کیف پول را واردکنید')
]

 // validationParamOrder
exports.validationParamOrder = [
    param('orderId')
        .notEmpty()
        .isMongoId()
        .withMessage('شناسه مشتری را وارد کنید')
]

// validation error with validationResult
exports.validationReq = (req,res,next)=>{

    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json({
            success : false,
            msg : errors.array()
        })
    }
    return next()
}