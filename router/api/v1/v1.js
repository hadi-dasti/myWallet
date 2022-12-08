const router = require('express').Router()

try{
    //create router for register and login user
    const customer = require('./user/user')
    router.use('/user',customer)
}catch(err){
    console.log(err)
}


module.exports = router