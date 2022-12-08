const User = require('../../model/user/User')
const PasswordReset = require('../../model/user/PasswordReset')
const nodeMailer = require('nodemailer')
const ErrorResponse = require('../../utiles/resError')





//register user
exports.registerUser= async(req,res,next)=>{

    // upload filename photo
    const file = req.file;
    console.log(file)

    const {
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
        nationalCode,
        gender
    } = req.body;

    // create new user
    try{
        const users = await User.create({
            firstName,
            lastName,
            email,
            password,
            phoneNumber,
            nationalCode,
            gender,
            photo : 'test'
        })

        const newUser = await users.save();

        if(!newUser){
            return next(new ErrorResponse('invalid User Error',404))
        }

        return res.status(201).json({
            success : true,
            data : {newUser},
            msg : 'valid user'
        })

    }catch(err){
        console.log(err)
        return next(new ErrorResponse('Internal Server Error', 500))
    }

}



// login user in app
exports.loginUser= async(req,res,next)=>{

    const {nationalCode, password } = req.body;

    try{
        if(!nationalCode||!password){
            return res.status(400).json({
                success : false,
                msg :`Duplicated field Error`
            })
        }
            //create user for login user
        const user = await User.findOne({nationalCode}).select("+password");

            if(!user){
                return next(new ErrorResponse(404,'invalid Error'))
            }

            // match password
        const isMatch = await user.matchPasswords(password)

        if(!isMatch){
            return res.status(404).json({
                success : false,
                msg :'invalid password match'
            })
        }

            // send  toke with jwt
        const token = await user.getSignToken()

        return res.status(200).json({
            success : true,
            data :{token},
            msg : 'send token'
        })

    }catch(err){
        console.log(err)
        return next(new ErrorResponse(500,'Internal Server Error'))

    }
}


//  forgetPassword user
exports.forgetPassword= async(req,res,next)=>{

    const email = req.body.email;
    const token = Math.random().toString(20).substr(2,12)

    try{
            const passwordResetUser = await PasswordReset.create({
                email,
                token
            })

        const newPasswordReset = await passwordResetUser.save()

        if(!newPasswordReset){
           return next(new ErrorResponse('Invalid Error', 404))
        }

        const transporter = nodeMailer.createTransport({
            host : '0.0.0.0',
            port : 1025
        })

        const url = `http://localhost:3000/reset/${token}`


        await transporter.sendMail({
            from :'test@example.com',
            to :email,
            subject :'reset your password',
            html :`click <a href="${url}">hear</a> to reset your password `
        })

        return res.status(200).json({
            success : true,
            msg :'check your email'
        })


    }catch(err){
        console.log(err)
        return next(new ErrorResponse('Internal Server Error',500))
    }
}


// reset Password user
exports.restPassword = async(req,res)=>{



        try{

            if(req.body.password !== req.body.password_confirm){

                return res.status(400).json({
                    success : false,
                    msg : "password do not match"
                })
            }

            const passwordRest = await PasswordReset.findOne({token:req.body.token})

            const {email} = await passwordRest.toJSON()

            const user = await User.findOne({email})


             await user.save()

            if(!user){
                return res.status(404).json({
                    success : false,
                    msg : 'user is not found'
                })
            }

            res.status(200).json({
                success : true,
                data : {user},
                msg : 'restPassword is successfully'
            })


        }catch (err){
            console.log(err)
            return res.status(500).json({
                success: false,
                msg : 'Internal Server Error'
            })
        }
}