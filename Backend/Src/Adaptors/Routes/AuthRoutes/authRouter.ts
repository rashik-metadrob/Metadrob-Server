import express from "express";
import { authControllers } from "../../Controllers";

export default (dependencies: any) => {
  const { registerValidation } = dependencies.inputValidation;

  const router = express();
  const { registerController } = authControllers(dependencies);

  router.post("/register", registerValidation, registerController);

  return router;
};
