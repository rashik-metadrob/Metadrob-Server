import {
  Register,
  RegisterInput,
} from "../../../Entities/AuthEntities/registerEntity"; // Ensure correct path

export const registerUseCase = (dependencies: any) => {
  const { registerRepository, tokenRepository } = dependencies.repository;
  const { sendVerificationEmail } = dependencies.services;
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

      const tokens = await tokenRepository.generateAuthTokens(user);

      const verifyEmailToken = await tokenRepository.generateVerifyEmailToken(
        user
      );

      const response: any = await sendVerificationEmail(
        user.email,
        verifyEmailToken
      );
      if (response) {
        const data = {
          user,
          tokens,
        };

        return { status: true, data: data };
      } else {
        return { status: false, message: "user register failed" };
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
