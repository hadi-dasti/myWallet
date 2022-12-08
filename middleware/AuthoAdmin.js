// authorization middleware for admin
const authPageAdmin = (permissions)=>{

    return (req,res,next)=>{

        const adminRole = req.body.role;

        if(permissions.includes(adminRole)){
            next()

        }else{

            return res.status(401).json({
                success : false,
                msg : "you don have permissions"
            })
        }

    }

}


module.exports = authPageAdmin