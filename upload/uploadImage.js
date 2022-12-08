const multer = require('multer')
const path = require('path')

// set destination and filename
const storage = multer.diskStorage({
    destination : (req,file,cb)=>{
        cb(null,path.join(process.cwd(),'public'))
    },
    filename :(req,file,cb)=>{
        cb(null,(Date.now()+file.originalname))
    }
})

// set filename and control file
const fileName = (req,file,cb)=>{
    if(file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype ==='image/jpeg')
    {
        cb(null,true)
    }else{
        cb(null,false)
    }
}

module.exports = multer(
    {
        storage : storage,
        fileFilter :fileName
    })