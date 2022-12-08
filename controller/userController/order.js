const Wallet = require('../../model/user/Wallet')
const Order = require('../../model/user/Order')
const User = require('../../model/user/User')
const ErrorResponse = require('../../utiles/resError')


// create order with walletID
exports.orderWallet = async(req,res,next)=>{

     let {orderCompany,orderWallet} = req.body;
    let {walletId} = req.params;

        //create order
    try{
        const orders = await Order.create({
            orderCompany,
            orderWallet,
            walletId
        })

        const newOrder = await orders.save();

            if(!newOrder) {
                return next(new ErrorResponse('Invalid Error',404))
            }

            // create order with walletId
        const createOrderWallet = await Wallet.findByIdAndUpdate(walletId,{

            $push :{orderId :newOrder._id}
        },{
            new:true
        })

         return res.status(201).json({
             success : true,
             data : {createOrderWallet,
                 newOrder},
             msg : 'create order wallet'
         })

    }catch(err){
        console.log(err)
        return next(new ErrorResponse('InterNal Server Error',500))
    }

}

// get all order with lookup
exports.getOrder = async (req,res,next)=>{

    try{

        const order = await Order.aggregate([

            {
                $lookup: {
                    from: "wallets",
                    localField: "_id",
                    foreignField: "orderId",
                    as: "wallet"
                }
            },
            {
                $unwind: "$wallet"
            },
            {
                $project : {
                    "createdAt": 0,
                    "updatedAt": 0,
                    "__v": 0
                }
            }
        ])

        if(!order){
            return next(new ErrorResponse(404,'Invalid Error'))
        }

        return res.status(200).json({
            success: true,
            data : {order},
            msg : 'ok get order with lookup'
        })

    }catch(err){
        console.log(err)
           return next(new ErrorResponse('InterNal Server Error'))
    }
}

// create user with wallet and order
exports.createUser= async(req,res,next)=>{

    const { firstName,
        lastName,
        email,
        password,
        phoneNumber,
        nationalCode,
        gender} = req.body;

    const {walletId,orderId} = req.params;

    try{

        // require model user
        const users  = await User.create({
            firstName,
            lastName,
            email,
            password,
            phoneNumber,
            nationalCode,
            gender,
            walletId,
            orderId
        })

        // create new user and save
         const newUser = await users.save();

        if(!newUser){
            return next(new ErrorResponse(404,'Invalid Error'))
        }

        //  create and push walletId in user
        const createUserWallet = await Wallet.findByIdAndUpdate(walletId,{
            $push : {userId : newUser._id}
        },
            {new : true})


        // create and push in orderId in user
        const createUserOrder = await Order.findByIdAndUpdate(orderId,{
            $push :{userId :newUser._id}
        },{
            new : true
        })


        return res.status(201).json({
            success: true,
            data: {
                newUser,
                createUserWallet,
                createUserOrder
            },
            msg : `create user with ${createUserOrder},${createUserWallet}`
        })

    }catch(err){
        console.log(err)
        return next(new ErrorResponse(500,'Internal Server Error'))

    }
}

// get user
exports.getUser= async(req,res,next)=>{

    try{
        const users = await User.aggregate([
            {
                $lookup : {
                    from :"wallets",
                    localField :"_id",
                    foreignField :"userId",
                    as : "wallet-user"

                }
            },
            {
                $unwind :"$wallet-user"
            },
            {
                $lookup : {
                    from :"orders",
                    localField: "_id",
                    foreignField: "userId",
                    as :"order-Wallet"
                }
            },
            {
                $unwind :"$order-Wallet"
            },
            {
                $match : {
                    $and :[{"firstName" : "hadi"}]
                }
            },
            {
                $project :{
                    "createdAt": 0,
                    "updatedAt": 0,
                    "__v": 0
                }
            }
            ])

        if(!users){
           return next(new ErrorResponse(404,'Invalid Error'))
        }
        
        return res.status(200).json({
            success : true,
            data :{users},
            msg : 'users successfully'
        })

    }catch(err){
        console.log(err)
        return next(new ErrorResponse(500,'InterNal Server Error'))
    }

}