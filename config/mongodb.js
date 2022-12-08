const mongoose = require('mongoose')

//connect DB
const connectDB = () => {
    mongoose.connect(process.env.MONGO_URI )
        .then(()=>console.log('connect to mongodb'))
        .catch((err)=>console.log(err))

}


module.exports = connectDB



