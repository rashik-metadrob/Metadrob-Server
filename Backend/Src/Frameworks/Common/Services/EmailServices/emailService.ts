
import { config } from '../../EnvInterface/envConfig';
import { sendEmail } from './sendEmail';
const sendVerificationEmail = async (to:string, token:any) => {
    console.log(to,token,"dzfzdv");
    
    const subject = 'Email Verification';
    // replace this url with the link to the email verification page of your front-end app
    const verificationEmailUrl = `${config.clientUrl}/verify-email?token=${token}`;
    const text = `Dear user,
  To verify your email, click on this link: ${verificationEmailUrl}
  If you did not create an account, then ignore this email.`;
    const emailResponse = await sendEmail(to, subject, text);
    return {emailResponse}
  };

  export {
    sendVerificationEmail
  }