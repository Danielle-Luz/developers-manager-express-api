import { iDeveloper, iMessage } from "./../interfaces";
import { NextFunction, Request, Response } from "express";

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
}
