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

    developerModelKeys.forEach((key) => {
      const hasKey = newDeveloperKeys.includes(key);

      if (!hasKey) {
        missingKeys.push(key);
      }
    });

    if (missingKeys.length > 0) {
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

    developerModelKeys.forEach((key) => {
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
    });

    if (wrongTypes.length > 0)
      return res.status(400).send({ errors: wrongTypes });

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

    if (developersCount > 0) {
      const errorMessage: iMessage = { message: "Email already exists." };

      return res.status(409).send(errorMessage);
    }

    return next();
  };

  export const storeDeveloperOnlyWithRightKeys = (
    req: Request,
    _: Response,
    next: NextFunction
  ) => {
    const { body: newDeveloper } = req;
    const developerOnlyWithRightKeys: iDeveloper = { name: "", email: "" };

    developerModelKeys.forEach((key) => {
      developerOnlyWithRightKeys[key] = newDeveloper[key];
    });

    req.body = developerOnlyWithRightKeys;

    next();
  };

  export const parseId = (req: Request, _: Response, next: NextFunction) => {
    const developerId = parseInt(req.params.id);
    req.parsedId = isNaN(developerId) ? -1 : developerId;

    next();
  };

  export const checkIfDeveloperExists = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const developerId = req.parsedId;

    const foundDeveloper = await database.getDevelopers(developerId);

    if (foundDeveloper.length === 0) {
      const errorMessage: iMessage = {
        message: "Developer not found.",
      };

      return res.status(404).send(errorMessage);
    }

    req.foundDeveloper = foundDeveloper[0];

    next();
  };
}
