import { RegisterInput } from "../../../../Entities/AuthEntities/registerEntity";
import { User } from '../../Database';
import { ApiError } from '../../../Common/Exceptions/ApiError'; // Assuming ApiError is defined somewhere
import httpStatus from 'http-status'; // Adjust the import if using a different package
import _ from 'lodash'; // Ensure lodash is installed and correctly imported
import { sendWelcomeEmail } from '../../../Common/Services/EmailServices'; // Adjust import according to your project structure
import { USER_ROLE } from '../../../Common/Utils/constant'; // Adjust import according to your project structure


export  default  {
  createUser : async  (userBody:RegisterInput)=>{
 try {
    if (userBody.email) {
        if (await User.isEmailTaken(userBody.email)) {
          throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
        }
    
        // Send a welcome email
        const text = 'You have successfully registered an account!';
        await sendWelcomeEmail(userBody.email, 'Welcome to Metadrob', text);
      }
    
      // Clone and modify the user data
      const body = _.cloneDeep(userBody);
      const role = _.get(body, 'role', USER_ROLE.RETAILERS);
      body.role = role; // Ensure the role is set properly
    
      // Create and return the user
      return User.create(body);
 } catch (error) {
    console.log(error,'ppppppppppppppppppp')
 }
  } 
};
