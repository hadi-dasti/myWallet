const router =  require('express').Router();
const jwt = require('jsonwebtoken')

// authentication for admin
router.use(async (req,res,next)=>{

    const token = req.headers.token

    if(!token){
        return res.status(401).json({
            success : false,
            msg : "invalid token"
        })
    }

    const authAdmin = await jwt.verify(token,process.env.JWT_SECRET_ADMIN)

    if(!authAdmin){
        return res.status(403).json({
            success : false,
            msg :'ابتدا باید وارد برنامه شوید'
        })
    }

    return  next()

})



module.exports = router