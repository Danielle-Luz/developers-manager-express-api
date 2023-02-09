import { Request, Response } from "express";
import { database } from "../database";
import { iMessage } from "../interfaces";

export namespace requests {
  export const createDeveloper = async (req: Request, res: Response) => {
    const { body: newDeveloper } = req;

    try {
      const createdDeveloper = await database.createDeveloper(newDeveloper);

      return res.status(201).send(createdDeveloper);
    } catch (error) {
      const errorObject = error as Error;

      const errorMessage: iMessage = {
        message: "Failed to insert the data in the database",
      };

      console.error(errorObject.stack);

      return res.status(500).send(errorMessage);
    }
  };
}
