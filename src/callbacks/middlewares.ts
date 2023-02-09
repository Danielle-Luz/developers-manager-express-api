import { iDeveloper, iDeveloperInfo, iMessage, os } from "./../interfaces";
import { NextFunction, Request, Response } from "express";
import { database } from "../database";

export namespace middlewares {
  const developerModel: iDeveloper = {
    name: "",
    email: "",
  };

  const developerInfoModel: iDeveloperInfo = {
    developer_since: new Date("2023/01/10"),
    preferred_os: "",
  };

  const developerModelKeys = Object.keys(developerModel);
  const developerInfoModelKeys = Object.keys(developerInfoModel);

  const checkKeys = (
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

  export const checkCreateDeveloperKeys = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    checkKeys(req, res, next, developerModelKeys);
  };

  export const checkCreateDeveloperInfoKeys = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    checkKeys(req, res, next, developerInfoModelKeys);
  };

  const checkTypes = (
    req: Request,
    res: Response,
    next: NextFunction,
    model: iDeveloperInfo | iDeveloper
  ) => {
    const { body: newData } = req;

    const newDataKeys = Object.keys(newData);

    const wrongTypes: iMessage[] = [];

    newDataKeys.forEach((key) => {
      const hasRightType = newData[key].constructor === model[key]?.constructor;
      const constructorName = model[key]?.constructor.name.toLowerCase();

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

  export const checkDeveloperTypes = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    checkTypes(req, res, next, developerModel);
  };

  export const checkDeveloperInfoTypes = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    checkTypes(req, res, next, developerInfoModel);
  };

  export const checkNotUniqueEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { body: newDeveloper } = req;
    const { email: newDeveloperEmail } = newDeveloper;

    if (newDeveloperEmail) {
      const { count: developersCount } = await database.getDevelopersCountByEmail(
        newDeveloperEmail
      );
  
      if (developersCount > 0) {
        const errorMessage: iMessage = { message: "Email already exists." };
  
        return res.status(409).send(errorMessage);
      }
    }

    return next();
  };

  const storeDataOnlyWithRightKeys = (
    req: Request,
    next: NextFunction,
    dataWithRightKeys: iDeveloper | iDeveloperInfo,
    rightKeys: string[]
  ) => {
    const { body: newData } = req;

    rightKeys.forEach((key) => {
      if (newData[key]) {
        dataWithRightKeys[key] = newData[key];
      }
    });

    req.body = dataWithRightKeys;

    next();
  };

  export const storeDeveloperOnlyWithRightKeys = (
    req: Request,
    _: Response,
    next: NextFunction
  ) => {
    const developerOnlyWithRightKeys: iDeveloper = { name: "", email: "" };

    storeDataOnlyWithRightKeys(
      req,
      next,
      developerOnlyWithRightKeys,
      developerModelKeys
    );
  };

  export const checkDateFormat = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const dateRegex = /^\d{4}\/\d{2}\/\d{2}$/;
    const hasRightDateFormat = dateRegex.test(req.body.developer_since);

    if (!hasRightDateFormat) {
      const errorMessage: iMessage = {
        message: "The date should have the format: 0000/00/00",
      };

      return res.status(400).send(errorMessage);
    }

    req.body.developer_since = new Date(req.body.developer_since);

    next();
  };

  export const checkPreferredOs = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const preferredOs = req.body.preferred_os + "";

    const formattedOs =
      (preferredOs[0] || "").toUpperCase() +
      preferredOs.substring(1).toLowerCase();

    const isAValidOs = os.includes(formattedOs);

    if (!isAValidOs) {
      const errorMessage: iMessage = {
        message: `Preferred OS should have one of this values: ${os.join(
          ", "
        )}`,
      };

      return res.status(400).send(errorMessage);
    }

    req.body.preferred_os = formattedOs;

    next();
  };

  export const storeDeveloperInfoOnlyWithRightKeys = (
    req: Request,
    _: Response,
    next: NextFunction
  ) => {
    const developerInfoOnlyWithRightKeys: iDeveloperInfo = {
      developer_since: new Date("2023/01/10"),
      preferred_os: "",
    };

    storeDataOnlyWithRightKeys(
      req,
      next,
      developerInfoOnlyWithRightKeys,
      developerInfoModelKeys
    );
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
