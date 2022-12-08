const UserHomePage = require('../../model/publicPage/UserPublicPage')
const CommentHomePage = require('../../model/publicPage/Comments')
const ErrorResponse = require('../../utiles/resError')




// CREATE USER ON HOMEPAGE
exports.createUserHomePage = async(req,res,next)=>{

        const {nickName,TelMobile} = req.body;

    try{
        const duplicatedMobile = await UserHomePage.find({
            TelMobile
        })

        if(duplicatedMobile.length){
            return res.status(400).json({
                success : false,
                msg : 'شماره موبایل وارد شده تکراری میباشد لطفا دوباره سعی کنید'
            })
        }

        const createHomePage = await UserHomePage.create({
            nickName,
            TelMobile
        })

        const newUserHomePage = await createHomePage.save()

        if(!newUserHomePage){
           return  next(new ErrorResponse(404 , 'Invalid Error'))
        }

        // send token
        const tokenHomePage = await newUserHomePage.getToken()

        return res.status(201).json({
            success : true,
            data :{newUserHomePage,tokenHomePage},
            msg : 'successfully user on Homepage for create comment'
        })

    }catch(err){
        console.log(err)
        return  next(new ErrorResponse(500, 'Internal Server Error'))
    }
}

//UPDATE USER ON HOMEPAGE FOR WRITING COMMENT
exports.updateUserHomePage =async(req,res,next)=>{

    try{
        const updateUserHomePage = await UserHomePage.findByIdAndUpdate(req.params.user,

            {
                      $set : req.body
                       },
             {
                 new :true
             })
                // console.log(updateUserHomePage)
        if(!updateUserHomePage) return next(new ErrorResponse(404,'Invalid Error '))

        // send token
        const tokenHomePage = await updateUserHomePage.getToken()

        return res.status(200).json({
            success : true,
            data : {updateUserHomePage,tokenHomePage},
            msg : "successfully update user in publicPage"
        })
    }catch(err){
        console.log(err)
    }
    return next(new ErrorResponse(500,'Internal Server Error'))
}

//CREATE COMMENT WITH  USERID ON  HOMEPAGE
exports.createCommentHomePage = async(req,res,next)=>{

    //CREATE INSTANCE OF COMMENTS
    const {textComments,isApproved} = req.body;

    const {id}= req.params;

    try{

        const createComments = await CommentHomePage.create({
            textComments,
            isApproved,
            id
        })

        // CREATE DOCUMENT OF COMMENTS IN DATABASE
        const NewCreateComment = await createComments.save();

        if(!NewCreateComment){
           return next(new ErrorResponse('Invalid Error',404))
        }

        // FIND THE  HOMEPAGE AND ADD THE CREATED COMMENT OBJECT ID INSIDE THE USER HOMEPAGE FIELD (FOREIGN KEY)
        const CreateCommentUserHomePage = await UserHomePage.findByIdAndUpdate(id,
            {
            $push :
                {comment:NewCreateComment._id}

        },
            {new : true}
        )

        return res.status(201).json({
            success : true,
            data :{comment: CreateCommentUserHomePage},
            msg : `successfully create comment `
        })

    }catch(err){
        console.log(err)
        return next(new ErrorResponse('Internal Server Error' ,500))
    }
}

// DELETE USER IN HOMEPAGE
exports.deleteHomePage = async(req,res,next)=>{

    try{
        const destroyHomePage = await UserHomePage.findByIdAndDelete(req.params.user)

        if(destroyHomePage)
            return res.status(200).json({
                success : true,
                msg : "successfully delete user in publicPage"
            })
    }catch(err){
        console.log(err)
        return next(new ErrorResponse(500,'Internal Server Error'))
    }
}



//GET ALL COMMENT WITH USER HOMEPAGE BY AGGREGATE
exports.getAllComments = async(req,res,next)=>{
    try{

        const createGetAllComment = await UserHomePage.aggregate([

            {
                $lookup : {
                    from : "commenthomepages",
                    localField :"comment",
                    foreignField :"_id",
                    as : "comments"
                }
            },
            {
                $unwind: "$comments",
            },
            {
                $project :{
                    "createdAt": 0,
                    "updatedAt": 0,
                    "__v": 0
                }
            }
        ])

        if(!createGetAllComment){
            return next(new ErrorResponse('Invalid Error',404))
        }
        return res.status(200).json({
            success : true,
            data : {createGetAllComment},
            msg : "successfully All Comments"
        })
    }catch(err){
        console.log(err)
        return next(new ErrorResponse('InterNal Server Error'),500)
    }
}

//GET ONE USER HOMEPAGE WITH COMMENT USER BY AGGREGATE
exports.getOneUserHomePage = async(req,res,next)=>{


    let id = require('mongodb').ObjectID


    try{

        const getOneUserHomePage = await UserHomePage.aggregate([

            {
                $match : {_id: new id(req.params.id)}
            },
            {
                $lookup :{
                    from :"commenthomepages",
                    localField :"comment",
                    foreignField :"_id",
                    as :"comments"
                }
            },
            {
                $unwind : "$comments"
            },
            {
                $project :{
                    "createdAt": 0,
                    "updatedAt": 0,
                    "__v": 0
                }
            }
        ])

        if(!getOneUserHomePage){
            return next(new ErrorResponse('Invalid Error', 404))
        }

        return res.status(200).json({
            success : true,
            data :{getOneUserHomePage},
            msg : 'successfully get user publicPage with comment'
        })

    }catch(err){
        console.log(err)
        return next(new ErrorResponse('Internal Server Error',500))
    }
}

//UPDATE COMMENTS WITH USERID ON HOMEPAGE
exports.updateComments = async (req,res,next)=>{




    // METHODE PUT
    try{

        const updateCommentHomePage = await CommentHomePage.findByIdAndUpdate(req.params.id,

            {$set: req.body},

            {new : true, select: { _id: 0, __v: 0, updatedAt: 0, createdAt: 0 }})
            console.log(req.body)
        if(!updateCommentHomePage) return next(new ErrorResponse(404,'Invalid Error'))

        return res.status(200).json({
            success : true,
            data : {updateCommentHomePage},
            msg :'successfully update comments with id publicPage'
        })

    }catch(err){
        console.log(err)
        return next(new ErrorResponse(500,'Internal Server Error'))
    }
}

//DELETE USER WITH COMMENTS
exports.deleteCommentHomePage = async(req,res,next)=>{

    try{

        const foundUser = await  UserHomePage.findByIdAndDelete(req.params.id)

        if(foundUser) await CommentHomePage.deleteMany({_id :{$in :foundUser.comment}})


        if(!foundUser) return next(new ErrorResponse(404,'Invalid Error'))


        return res.status(200).json({
            success : true,
            msg : 'successfully userHomePage with owen comments'
        })


    }catch(err){
        console.log(err)
        return next(new ErrorResponse(500,'Internal Server Error'))
    }
}


