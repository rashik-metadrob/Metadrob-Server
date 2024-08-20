import * as dotenv from 'dotenv';
dotenv.config()

export default {
    port :process.env.PORT,
    mongo:{
        uri:process.env.MONGODB_URL
    }
}