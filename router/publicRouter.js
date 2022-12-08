const router = require('express').Router()


// create publicPage
try{
    const homePageRouter = require('./publicPageApi/homePageRouter')
    router.use('/v1',homePageRouter)

    const userHomePageRouter = require('./publicPageApi/userHomePageRouter')
    router.use('/v1/createUser',userHomePageRouter)

}catch(err){
    console.log(err)
}



module.exports= router