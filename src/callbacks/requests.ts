import { iDeveloperJoinDeveloperInfo } from "./../interfaces";
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

  export const getDevelopers = async (req: Request, res: Response) => {
    let developerId = parseInt(req.params.id);
    developerId = isNaN(developerId) ? -1 : developerId;
    const hasId = developerId || developerId === 0;

    try {
      const allDevelopersList: iDeveloperJoinDeveloperInfo[] = hasId
        ? await database.getDevelopers(developerId)
        : await database.getDevelopers();

      if (hasId && allDevelopersList.length === 0) {
        const errorMessage: iMessage = {
          message: "Developer not found.",
        };

        return res.status(404).send(errorMessage);
      }
      return res.status(200).send(allDevelopersList);
    } catch (error) {
      const errorMessage: iMessage = {
        message: "Failed to get developers data in the database",
      };

      const errorObject = error as Error;

      console.error(errorObject.stack);

      return res.status(500).send(errorMessage);
    }
  };
}
