import path from "path"
import { config } from '../../EnvInterface/envConfig';
import handlebars from "handlebars"
import nodemailer from "nodemailer"
import fs from "fs"
const transport = nodemailer.createTransport(config.email.smtp)

const readHTMLFile = function (path,callback){
    fs.readFile(path,{encoding:'utf-8'},function(err,html){
        if(err){
            callback(err)
        }else{
            callback(null,html)
        }
    })
}
const sendWelcomeEmail = async (to:any, subject:any, text:any) => {
    return new Promise<void>((resolve, reject) => {
      const msg = { from: config.email.from, to, subject, text };
  
      readHTMLFile(path.join(process.cwd(), `public/email-templates/register-template/index.html`), function(err:any, html) {
        if (err) {
          reject(err)
          return;
        }
        var template = handlebars.compile(html);
        var replacements = {
          dashboardUrl: config.clientUrl,
          templateAssetUrl: `${config.serverUrl}/email-templates/register-template`
        };
        var htmlToSend = template(replacements);
        var mailOptions = {
            ...msg,
            html : htmlToSend
         };
         transport.sendMail(mailOptions, function (error, response) {
            if (error) {
              console.log(error);
              reject(err)
            } else {
              resolve()
            }
        });
      });
    })
  };
  export{
    sendWelcomeEmail
  }

