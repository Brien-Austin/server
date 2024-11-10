const {createClient} = require("redis")
const redisClient = createClient({
    password: 'k0BxlYEKSEqXxfXT5emN7aOWMkqnDzvl',
    socket: {
        host: 'redis-15411.c74.us-east-1-4.ec2.redns.redis-cloud.com',
        port: 15411
    }
});


const connectRedisCache = async() =>{
    try {
        await redisClient.connect()
        console.log("Connected to Redis Cache")
        
    } catch (error) {
        console.log("[ERROR_CONNECTING_TO_REDIS_CACHE]",error)
        
    }
}

module.exports = {connectRedisCache, redisClient}