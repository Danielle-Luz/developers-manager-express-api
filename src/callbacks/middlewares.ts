import { iDeveloper, iMessage } from "./../interfaces";
import { NextFunction, Request, Response } from "express";
import { database } from "../database";

export namespace middlewares {
  const developerModel: iDeveloper = {
    name: "",
    email: "",
  };

  const developerModelKeys = Object.keys(developerModel);

  export const checkDeveloperKeys = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { body: newDeveloper } = req;
    const newDeveloperKeys = Object.keys(newDeveloper);
    const missingKeys: string[] = [];

    const hasAllKeys = developerModelKeys.every((key) => {
      const hasKey = newDeveloperKeys.includes(key);

      if (!hasKey) {
        missingKeys.push(key);
      }

      return hasKey;
    });

    if (!hasAllKeys) {
      const errorMessage: iMessage = {
        message: "Missing required keys: " + missingKeys.join(", "),
      };
      return res.status(400).send(errorMessage);
    }

    return next();
  };

  export const checkDeveloperTypes = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { body: newDeveloper } = req;

    const wrongTypes: iMessage[] = [];

    const hasAllRightTypes = developerModelKeys.every((key) => {
      const hasRightType =
        newDeveloper[key].constructor === developerModel[key]?.constructor;
      const constructorName =
        developerModel[key]?.constructor.name.toLowerCase();

      if (!hasRightType) {
        const errorMessage: iMessage = {
          message: `Property ${key} shoud have ${constructorName} type`,
        };

        wrongTypes.push(errorMessage);
      }

      return hasRightType;
    });

    if (!hasAllRightTypes) return res.status(400).send({ errors: wrongTypes });

    return next();
  };

  export const checkNotUniqueEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { body: newDeveloper } = req;
    const { email: newDeveloperEmail } = newDeveloper;

    const { count: developersCount } = await database.getDevelopersCountByEmail(
      newDeveloperEmail
    );

    if (developersCount > 1) {
      const errorMessage: iMessage = { message: "Email already exists." };

      return res.status(409).send(errorMessage);
    }

    return next();
  };
}
