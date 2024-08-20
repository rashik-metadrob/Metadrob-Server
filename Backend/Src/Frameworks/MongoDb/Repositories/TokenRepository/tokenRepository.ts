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
  
  generateToken: async (userId: string, expires: any, type: any, secret = config.jwt.secret) => {
    const payload = {
      sub: userId,
      iat: moment().unix(),
      exp: expires.unix(),
      type,
    };
    return jwt.sign(payload, secret);
  },


   
  generateAuthTokens: async (user: User, shouldSaveToken: boolean = true) => {
    // Calculate expiration dates
    const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
    const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');

    // Generate tokens using the generateToken function
    const accessToken = await (this as any).generateToken(user.id, accessTokenExpires, tokenTypes.ACCESS);
    const refreshToken = await (this as any).generateToken(user.id, refreshTokenExpires, tokenTypes.REFRESH);

    // Optionally save the refresh token
    if (shouldSaveToken) {
      await (this as any).saveToken(refreshToken, user.id, refreshTokenExpires.toDate(), tokenTypes.REFRESH);
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
    const verifyEmailToken = await  (this as any).generateToken(user.id, expires, tokenTypes.VERIFY_EMAIL);
    await (this as any).saveToken(verifyEmailToken, user.id, expires, tokenTypes.VERIFY_EMAIL);
    return verifyEmailToken;
  },

  saveToken: async (token, userId, expires, type, blacklisted = false) =>{
    console.log(expires,"test expires");
    
    const tokenDoc = await Token.create({
      token,
      user: userId,
      expires: expires,
      type,
      blacklisted,
    });
    return tokenDoc;

  }



};
