const HomePage = require('../../model/publicPage/PublicPage')
const ErrorResponse = require('../../utiles/resError')
const redis = require('redis')
const Client = redis.createClient({url:process.env.REDIS})
Client.connect()


// create post with redis
exports.createHomePageRedis = async(req,res,next)=>{
    const {USD,price} = req.body;

    try{
        const key = await Client.set(USD,price)
        const keyEx = await Client.expire(USD,1000)

        if(!key && !keyEx){
            return next(new ErrorResponse('invalid Error', 404))
        }

        return res.status(201).json({
            success : true,
            data :`${key} and ${keyEx}`,
            msg : 'ok redis'
        })

    }catch(err){
        console.log(err)
        return next(new ErrorResponse('InterNal Server Error',500))
    }

}

// get client redis
exports.getHomePageRedis = async(req,res,next)=>{
    const {
        USD
    }=req.body
    try{
            const values = await Client.get(USD)

        if(!values){
            return  next(new ErrorResponse('invalid Error',404))
        }


        return res.status(200).json({
            success : true,
            data : {values},
            msg :'successfully  get values '
        })
    }catch(err){
        console.log(err)
        return next(new ErrorResponse('Internal Server Error',500))
    }
}



// create post with mongodb
exports.createHomePageMongo = async(req,res,next)=>{

      const {
          USD,
          price,
          Exchange_rate,
          priceMonthly
      } = req.body;

    try{
        const createHomePage = await HomePage.create({
            USD,
            price,
            Exchange_rate,
            priceMonthly
        })

        // save modelSchema in controller
        const newCreateHomePage = await createHomePage.save()

        if(!newCreateHomePage){
           return next(new ErrorResponse('Invalid Error',404))
        }

        return res.status(201).json({
            success : true,
            data : {newCreateHomePage},
            msg :'successfully create publicPage with mongodb'
        })

    }catch(err){
        console.log(err)
        return next(new ErrorResponse('Internal Server Error',500))
    }

}

//get All model in publicPage
exports.getAllHomePage = async(req,res,next)=>{

     try{
         const homePage = await HomePage.find({},{
             __v : 0,
             createdAt : 0,
             updatedAt : 0
         })

         if(!homePage){
            return next(new ErrorResponse('Invalid Error',404))
         }

         return res.status(200).json({
             success : true,
             data : {homePage},
             msg : 'successfully getAll publicPage'
         })

     }catch(err){
         console.log(err)
         return next(new ErrorResponse('Internal Server Error',500))
     }
}

//get  with aggregate
exports.getIdOneHomePage = async(req,res,next)=>{

    try{
        const getOneHomePage = await HomePage.aggregate([

            {
                $match :
                    {
                        USD :
                            {
                            $in : ["ret","bitcoin","bitcoin2","tetter"]
                          },

                    $and :
                        [
                            {
                                priceMonthly: { $lt: 900000}
                            },

                            {
                                price : { $gt : "1000"}
                            }
                    ]
                    }

            },

            {
                $group :
                    {
                        _id : ["$USD", "$price"],
                        count : {$sum : 1},
                        totalPrice :{$sum : "$priceMonthly"},
                        average : {$avg :"$priceMonthly"}
                    }
            },
            {
                $sort :
                    {
                    "count" : -1
                 }
            },
            {
                $skip :2
            },
            {
                $limit :4
            },
            {
                $project :
                    {
                        createdAt: 0,
                        updatedAt: 0,
                        __v: 0
                    }
            }

        ])

        if(!getOneHomePage){
          return next(new ErrorResponse('Invalid Error',404))
        }

        return res.status(200).json({
            success : true,
            data :{getOneHomePage},
            msg :'successfully get one in publicPage'
        })

    }catch(err){
        console.log(err)
        return next(new ErrorResponse('Internal Server Error',500))
    }
}

// update model publicPage
exports.updateHomePage = async(req,res,next)=>{

                let id= req.params.id;

            try{
                const updateHomePage = await HomePage.findByIdAndUpdate(id,

                    {
                                $set : req.body
                },
                    { new : true,

                    projection : {
                        __v: 0,
                        updatedAt: 0,
                        createdAt: 0
                    }
                    })

                if(!updateHomePage){
                    return next(new ErrorResponse('invalid Error update '))
                }

                return res.status(200).json({
                    success : true,
                    data : {updateHomePage},
                    msg : 'successfully  update publicPage '
                })

            }catch(err){
                console.log(err)
                return next(new ErrorResponse('Internal Server Error'))
            }
}

//delete publicPage
exports.destroyHomePage = async(req,res,next)=>{
            let id = req.params.id
    try{

        const destroy = await HomePage.findByIdAndDelete(id)

        if(destroy){
            return res.status(200).json({
                success : true,
                msg : 'successfully delete publicPage'
            })

        }else{
            return next(new ErrorResponse('invalid id Error', 404))
        }

    }catch(err){
        console.log(err)

        return next(new ErrorResponse('Internal Server Error',500))
    }

}



// search with regex
exports.searchUsd = async(req,res,next)=>{

            const searchUsd = req.query.USD
    try{
        const searchData = await HomePage.find(
            {
                USD :{ $regex:searchUsd , $options : '$i'}
            }
        )

        if(!searchData)  return next(new ErrorResponse('Invalid Error',404))

        return res.status(200).json({
            success : true,
            data: {searchData},
            msg : 'successfully search in api'
        })


    }catch(err){
        console.log(err)

        return next(new ErrorResponse('Internal Server Error',500))
    }

}