import {
  Register,
  RegisterInput,
} from "../../../Entities/AuthEntities/registerEntity"; // Ensure correct path




export const registerUseCase = (dependencies: any) => {


  const{registerRepository,tokenRepository} = dependencies.repository
  const { sendVerificationEmail} =dependencies.services
  const executeFunction = async (data: RegisterInput) => {
    try {
      // Validate the data (additional validation can be added as needed)
      if (
        !data.name ||
        !data.email ||
        !data.password ||
        !data.role ||
        !data.appSource
      ) {
        return { status: false, message: "Missing required fields." };
      }
   
      const newUser = new Register(data);
      const user = await registerRepository.createUser(newUser);
      console.log(user,'test user');
      
      const tokens = await tokenRepository.generateAuthTokens(user);
      console.log(tokens,'}}}}}}}')
      const verifyEmailToken = await tokenRepository.generateVerifyEmailToken(user);
      console.log(verifyEmailToken,"verified");
      
       const response:any = await sendVerificationEmail(user.email, verifyEmailToken);
       console.log(response,"send");
       
       if(response){
        console.log("come");
        
        return {status:true,message:"user register successfully"}
       }
    } catch (error) {
      console.error("Error occurred during registration:", error);
      return {
        status: false,
        message: "An error occurred during registration.",
      };
    }
  };

  return { executeFunction };
};
