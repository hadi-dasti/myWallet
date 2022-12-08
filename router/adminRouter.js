const router = require('express').Router()


try{
    const createAdminApi =  require('./admin/adminApi')
    router.use('/admin',createAdminApi)
}catch(err){
    console.log(err)
}





module.exports = router