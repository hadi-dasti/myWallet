//Models
const Admin = require('../../model/admin/Admin')
//ErrorHandler
const ErrorResponse = require('../../utiles/resError')





//register Admin
exports.registerAdmin = async(req,res,next)=>{

        const {
                username,
                email,
                password,
                phoneNumber,
                role,
                isActive,
                isVerified
        } = req.body;

        try{

                // find email and password in db
                const duplicatedEmailAndPhoneNumberAdmin = await Admin.find({
                        email,
                        phoneNumber,
                },
                    {
                            "_v" :0
                    })


                if(duplicatedEmailAndPhoneNumberAdmin.length){
                   return res.status(400).json({
                           success : false,
                           msg :'ایمیل و  شماره تلفن وارد شده تکراری میباشد دوباره تلاش کنید'
                   })
                }


                const admins = await Admin.create({
                        username,
                        email,
                        password,
                        phoneNumber,
                        role,
                        isActive,
                        isVerified
                })

                const newAdmin = await admins.save();

                if(!newAdmin){
                   return next(new ErrorResponse(404,'Invalid Error'))
                }

                return res.status(201).json({
                        success : true,
                        data :{newAdmin},
                        msg :"Successfully create Admin for Api"
                })

        }catch(err){
            console.log(err)
                return next(new ErrorResponse(500,'Internal Server Error'))
        }
}

// login Admin
exports.loginAdmin = async(req,res,next)=>{

                const {email,password } = req.body;
        try{

                if(!email || !password) {
                        return next(new ErrorResponse(400, 'Please Provide an email and Password'))
                }

                const admins = await Admin.findOne({email}).select('+password')

                if(!admins){
                   return next(new ErrorResponse(404,'Invalid Error'))
                }

                // match password
                const isMatchPassword = await admins.matchPassword(password)

                if(!isMatchPassword){
                     return next(new ErrorResponse(404,'Invalid Error'))
                }

                // send token
                const token = await admins.getToken();

                return res.status(200).json({
                        success:true,
                        data : {token},
                        msg:"authentication with jwt successfully..."
                })


        }catch(err){
                console.log(err)
                return next(new ErrorResponse(500,'Internal Server Error'))
        }
}

//test auth admin
exports.testAdmin =async (req,res,next)=>{

        try{
                const testAdmin = await Admin.find();

                if(!testAdmin){
                   return next(new ErrorResponse(404,'Invalid Error'))
                }

                return res.status(200).json({
                        success : true,
                        data : {testAdmin},
                        msg : "successfully create authorization Admin"
                })
        }catch(err){
                return next(new ErrorResponse(500,'Internal Server Error'))

        }
}