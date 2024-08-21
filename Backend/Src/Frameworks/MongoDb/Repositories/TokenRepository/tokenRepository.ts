import moment from 'moment';
import { config } from '../../../Common/EnvInterface/envConfig';
import { tokenTypes } from '../../../Common/Config/tokens';
import jwt from 'jsonwebtoken';
import { Token } from "../../Database";
// Define a type for the user object to improve type safety
interface User {
  id: string;
}

export default {
  
 


   
  generateAuthTokens: async (user: User, shouldSaveToken: boolean = true) => {
    // Calculate expiration dates
    const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
    const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');

    // Generate tokens using the generateToken function
    const accessToken = await generateToken(user.id, accessTokenExpires, tokenTypes.ACCESS);
    const refreshToken = await generateToken(user.id, refreshTokenExpires, tokenTypes.REFRESH);

    // Optionally save the refresh token
    if (shouldSaveToken) {
      await saveToken(refreshToken, user.id, refreshTokenExpires.toDate(), tokenTypes.REFRESH);
    }

    // Return tokens with their expiration details
    return {
      access: {
        token: accessToken,
        expires: accessTokenExpires.toDate(),
      },
      refresh: {
        token: refreshToken,
        expires: refreshTokenExpires.toDate(),
      },
    };
  },
  generateVerifyEmailToken : async (user:any)=>{
    const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
    const verifyEmailToken = await  generateToken(user.id, expires, tokenTypes.VERIFY_EMAIL);
    await saveToken(verifyEmailToken, user.id, expires, tokenTypes.VERIFY_EMAIL);
    return verifyEmailToken;
  },


 


};


const  generateToken= async (userId: string, expires: any, type: any, secret = config.jwt.secret) => {
    const payload = {
      sub: userId,
      iat: moment().unix(),
      exp: expires.unix(),
      type,
    };
    return jwt.sign(payload, secret);
  }

  const  saveToken= async (token, userId, expires, type, blacklisted = false) =>{
    const expireDate=new Date(expires)
    const tokenDoc = await Token.create({
      token,
      user: userId,
      expires: expireDate,
      type,
      blacklisted,
    });
    return tokenDoc;

  }


