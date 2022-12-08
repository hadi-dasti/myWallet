const router = require('express').Router()

try{
    // join on version 1 app
    const v1 = require('./v1/v1')
    router.use('/v1',v1)

}catch(err){
    console.log(err)
}

module.exports = router