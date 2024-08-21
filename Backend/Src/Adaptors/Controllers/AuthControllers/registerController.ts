import { Request, Response } from "express";
import httpStatus from "http-status";
export default (dependecies: any) => {
  const { registerUseCase } = dependecies.useCase;
  const registerController = async (req: Request, res: Response) => {
    const responce = await registerUseCase(dependecies).executeFunction(
      req.body
    );
    if (responce.status) {
      res
        .status(httpStatus.CREATED)
        .send({ user: responce?.data?.user, tokens: responce?.data?.tokens });
    }
  };

  return registerController;
};
