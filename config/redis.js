const redis =  require('redis')


const client = () =>{
        redis.createClient({url:process.env.REDIS})

    console.log('connect on redis')
}



module.exports = client

