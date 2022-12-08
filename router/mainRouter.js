const router = require('express').Router()

try{
    // join on apiRouter
    const apiRouter = require('./api/apiRouter')
    router.use('/api',apiRouter)
}catch(err){
    console.log(err)
}

module.exports = router