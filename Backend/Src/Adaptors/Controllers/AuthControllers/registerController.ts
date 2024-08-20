import { Request, Response } from "express";

export default (dependecies: any) => {
  const { registerUseCase } = dependecies.useCase;
  const registerController = async (req: Request, res: Response) => {

    const responce = await registerUseCase(dependecies).executeFunction(req.body);

    res.json(responce)


  };

  return registerController;
};
