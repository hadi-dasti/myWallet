const router = require('express').Router()

//controller
const {createHomePageRedis,getHomePageRedis,createHomePageMongo,getAllHomePage,getIdOneHomePage,updateHomePage,destroyHomePage,searchUsd} = require('../../controller/publicPageController/homePage')


//redis
//create router set key and value
router.post('/publicPage',createHomePageRedis)
// create router get value
router.get('/homepage/getAll',getHomePageRedis)



//mongodb
//create router post for mongodb
router.post('/publicPage/mongo',createHomePageMongo)

// get all homPage
router.get('/publicPage/getAllMongodb',getAllHomePage)

// req.params
router.get('/homepage/test',getIdOneHomePage)

//update router
router.put('/homepage/:id',updateHomePage)

// delete router for homeOPage
router.delete('/publicPage/:id',destroyHomePage)

// create  filter search in publicPage with regex
router.get('/publicPage/searchUsd',searchUsd)


module.exports = router