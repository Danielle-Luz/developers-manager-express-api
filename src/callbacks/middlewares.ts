import {
  iDeveloper,
  iDeveloperInfo,
  iDeveloperJoinDeveloperInfo,
  iMessage,
  os,
} from "./../interfaces";
import { NextFunction, Request, Response } from "express";
import { database } from "../database";

export namespace middlewares {
  const developerModel: iDeveloper = {
    name: "",
    email: "",
  };

  const developerInfoModel: iDeveloperInfo = {
    developerSince: new Date("2023/01/10"),
    preferredOs: os.Linux,
    developerId: 1,
  };

  const developerModelKeys = Object.keys(developerModel);
  const developerInfoModelKeys = Object.keys(developerInfoModel);

  export const checkKeys = (
    req: Request,
    res: Response,
    next: NextFunction,
    modelKeys: string[]
  ) => {
    const { body: newData } = req;

    const newDataKeys = Object.keys(newData);

    const missingKeys: string[] = [];

    modelKeys.forEach((key) => {
      const hasKey = newDataKeys.includes(key);

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

  export const checkDeveloperKeys = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    checkKeys(req, res, next, developerModelKeys);
  };

  export const checkDeveloperInfoKeys = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    checkKeys(req, res, next, developerInfoModelKeys);
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
