import { config } from '../../EnvInterface/envConfig';
import nodemailer from "nodemailer"
const transport = nodemailer.createTransport(config.email.smtp)
const sendEmail = async (to:any, subject:any, text:any) => {
    const msg = { from: config.email.from, to, subject, text };
    await transport.sendMail(msg);
  };
  export {
    sendEmail
  }