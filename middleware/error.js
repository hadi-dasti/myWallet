const ApiErrorClass = require('../utiles/resError')


const errorHandler = (err,req,res,next)=>{
        console.log(err)

    if(err instanceof ApiErrorClass ){
        return res.status(err.statusCode).json({
            success : false,
            error : err.msg
        })
    }

    return  res.status(500).json({
        success : false,
        error : 'something went wrong'
    })
}

module.exports = errorHandler