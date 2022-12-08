const router = require('express').Router()
const jwt = require('jsonwebtoken')




router.use(async(req,res,next)=>{

    const token =  req.headers.token;

    if(!token){
        return res.status(401).json({
            success : false,
            msg : "Invalid token"
        })
    }
    const authStatus = await jwt.verify(token,process.env.JWT_SECRET)

    if(!authStatus){
       return res.status(403).json({
           success : false,
           msg :'ابتدا باید وارد برنامه شوید'
       })
    }

    return next()
})

module.exports = router