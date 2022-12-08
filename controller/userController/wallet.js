const Wallet = require('../../model/user/Wallet')
const Order = require('../../model/user/Order')
const ErrorResponse = require('../../utiles/resError')

// create wallet
exports.createWallet = async(req,res,next)=>{

    const {statusWallet,walletName} = req.body;

    try{
        const wallet = await Wallet.create({
            statusWallet,
            walletName
        })

        const wallets = await wallet.save();

        if(!wallets){
            return next(new ErrorResponse(404,'Invalid Error'))
        }

        return res.status(201).json({
            success : true,
            data : wallets,
            msg : 'successfully create new wallet'
        })

    }catch(err){
        console.log(err)
         return next(new ErrorResponse(500,'Internal Server Error'))
    }
}


//get walletOrder with populate
exports.getWallet = async(req,res,next)=>{

    try{

        const orderWallet = await Wallet.find({}).populate('orderId')

        if(!orderWallet){
            return next(new ErrorResponse(404,'Invalid Error'))
        }

        return res.status(200).json({
            success : true,
            data : {orderWallet},
            msg :'ok wallet'
        })

    }catch(err){
        console.log(err)
        return next(new ErrorResponse(500,'Internal Server Error'))
    }
}

//create lookup
exports.createLookup = async(req,res,next)=>{
    try{
        const walletOrders = await Wallet.aggregate([

                {
                    $lookup: {
                        from: "orders",
                        localField:"orderId",
                        foreignField: "_id",
                        as: "order"
                    }
                },
            {
                $unwind : "$order"
            },
            {
                $project : {
                    "createdAt": 0,
                    "updatedAt": 0,
                    "__v": 0
                }
            }
        ])

        if(!walletOrders){
            return next(new ErrorResponse(404,'Invalid Error'))
        }

        return res.status(200).json({
            success : true,
            data :{walletOrders},
            msg : 'ok'
        })

    }catch(err){
        console.log(err)
        return next(new ErrorResponse(500,'Internal Server Error'))
    }
}


//get on wallet with _id
exports.createOneWallet = async(req,res,next)=>{

    let walletId = req.params;

    try{

        const getOneWallet = await Wallet.findById(walletId,
            {
            __v :false,
            updatedAt: false,
            createdAt: false
        })
            .populate('orderId',

            {  __v :false,
                updatedAt: false,
                createdAt: false
            })


        if(!getOneWallet){
            return next(new ErrorResponse(404,'Invalid Error'))
        }

        return res.status(200).json({
            success: true,
            data :{getOneWallet},
            msg : 'successfully get one wallet with id'
        })

    }catch(err) {
        console.log(err)
        return next(new ErrorResponse(500,'Internal Server Error'))
    }
}

// update wallet
exports.updateWallet= async(req,res,next)=>{

            const walletId = req.params;

    try{

        const editWalletId = await Wallet.findByIdAndUpdate(walletId,

            { $set:req.body},

            { new: true,

                  select: {
                     __v: 0,
                    updatedAt: 0,
                    createdAt: 0
                 }
            })

        if(!editWalletId) return next(new ErrorResponse(404,'Invalid Error'))


        return res.status(200).json({
            success : true,
            data : {editWalletId},
            msg : 'update successfully'
        })

    }catch(err){
        console.log(err)
        return next(new ErrorResponse(500,'Internal Server Error'))
    }
}

//delete wallet
exports.deleteWallets = async(req,res,next)=>{

    const {walletId} = req.params

    try{
        // find wallet for delete
        const foundPackage = await Wallet.findByIdAndDelete(walletId)

            // delete wallet successfully and found orderId  for delete
        if(foundPackage){
            await Order.deleteMany({
                _id :{$in :foundPackage.orderId}
            })
        }

        return res.status(200).json({
            success : true,
            msg : 'deleted wallet '
        })

    }catch(err){
        console.log(err)
        return next(new ErrorResponse(500,'Internal Server Error'))
    }

}