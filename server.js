require('dotenv').config({path :'./config.env'})


// require framework for start api
const express = require('express')
const path = require('path')

// require mongoDB on server.js
const connectDB  = require('./config/mongodb')

// config redis
const redis = require('./config/redis')

// create main app
const app = express()

//config router handler
const errorHandler = require('./middleware/error')

// run mongodb
connectDB();

//redis
redis()


//middleware
app.use(express.json())
app.use(express.urlencoded({ extended :true}))

// public
app.use('/public',express.static(path.join(__dirname,'public')))

// create main router for start app
app.use('/',require('./router/mainRouter'))
//create homeRouter for publicPage Api
app.use('/',require('./router/publicRouter'))
// create  admin router for api
app.use('/',require('./router/adminRouter'))


// Error Handler
app.use(errorHandler)

// config port on server.js
const PORT = process.env.PORT || 5000


//start api
app.listen(PORT,()=> console.log(`successfully api with port ${PORT}`))