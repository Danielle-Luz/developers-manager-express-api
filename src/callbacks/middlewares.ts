import {
  iDeveloper,
  iDeveloperInfo,
  iMessage,
  iProject,
  iTechnology,
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
    preferredOS: "",
  };

  const projectModel: iProject = {
    name: "",
    description: "",
    estimatedTime: "",
    repository: "",
    startDate: new Date("2023/01/10"),
    developerId: 0,
  };

  const technologyModel: iTechnology = {
    name: ""
  };

  const developerModelKeys = Object.keys(developerModel);
  const developerInfoModelKeys = Object.keys(developerInfoModel);
  const projectModelKeys = Object.keys(projectModel);
  const technologyModelKeys = Object.keys(technologyModel);

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
      let errorMessage: iMessage = { message: "" };
      if (req.method !== "PATCH") {
        errorMessage = {
          message: "Missing required keys: " + missingKeys.join(", "),
        };
      } else {
        errorMessage = {
          message: "At least one of those keys must be send.",
          keys: missingKeys,
        };
      }
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

  export const checkProjectKeys = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    checkKeys(req, res, next, projectModelKeys);
  };

  export const checkTechnologiesKeys = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    checkKeys(req, res, next, technologyModelKeys);
  };

  export const checkEmptyKeys = (
    req: Request,
    res: Response,
    next: NextFunction,
    modelKeys: string[]
  ) => {
    const dataKeys = Object.keys(req.body);

    if (dataKeys.length === 0) {
      const errorMessage: iMessage = {
        message: "At least one of those keys must be send.",
        keys: modelKeys,
      };

      return res.status(400).send(errorMessage);
    }

    next();
  };

  export const checkEmptyDeveloperKeys = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    checkEmptyKeys(req, res, next, developerModelKeys);
  };

  export const checkEmptyDeveloperInfoKeys = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    checkEmptyKeys(req, res, next, developerInfoModelKeys);
  };

  export const checkEmptyProjectKeys = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    checkEmptyKeys(req, res, next, [...projectModelKeys, "endDate"]);
  };

  const checkTypes = (
    req: Request,
    res: Response,
    next: NextFunction,
    model: iDeveloperInfo | iDeveloper | iProject | iTechnology
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

  export const checkProjectTypes = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const projectModelWithEndDate = { ...projectModel };

    if (req.body.endDate) {
      projectModelWithEndDate.endDate = new Date("2023/03/01");
    }

    checkTypes(req, res, next, projectModelWithEndDate);
  };

  export const checkTechnologiesTypes = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    technologyModel.addedIn = new Date();
    
    checkTypes(req, res, next, technologyModel);
  };

  export const checkNotUniqueEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { body: newDeveloper } = req;
    const { email: newDeveloperEmail } = newDeveloper;

    if (newDeveloperEmail) {
      const { count: developersCount } =
        await database.getDevelopersCountByEmail(newDeveloperEmail);

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
    dataWithRightKeys:
      | iDeveloper
      | iDeveloperInfo
      | Partial<iProject>
      | Partial<iTechnology>,
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
    const developerOnlyWithRightKeys: iDeveloper = {};

    storeDataOnlyWithRightKeys(
      req,
      next,
      developerOnlyWithRightKeys,
      developerModelKeys
    );
  };

  export const storeProjectOnlyWithRightKeys = (
    req: Request,
    _: Response,
    next: NextFunction
  ) => {
    const projectOnlytWithRightKeys: Partial<iProject> = {};

    storeDataOnlyWithRightKeys(req, next, projectOnlytWithRightKeys, [
      ...projectModelKeys,
      "endDate",
    ]);
  };

  export const storeDeveloperInfoOnlyWithRightKeys = (
    req: Request,
    _: Response,
    next: NextFunction
  ) => {
    const developerInfoOnlyWithRightKeys: iDeveloperInfo = {};

    storeDataOnlyWithRightKeys(
      req,
      next,
      developerInfoOnlyWithRightKeys,
      developerInfoModelKeys
    );
  };

  export const storeTechnologiesOnlyWithRightKeys = (
    req: Request,
    _: Response,
    next: NextFunction
  ) => {
    const technologiesOnlyWithRightKeys: Partial<iTechnology> = {};

    storeDataOnlyWithRightKeys(
      req,
      next,
      technologiesOnlyWithRightKeys,
      technologyModelKeys
    );
  };

  export const checkIfDeveloperHasInfo = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const developerWithUpdatedInfo = (
      await database.getDevelopers(req.parsedId)
    )[0];
    const updatedDeveloperInfoId = Object.values(developerWithUpdatedInfo)[0];

    const errorMessage: iMessage = {
      message: "",
    };

    if (req.method === "PATCH") {
      if (isNaN(updatedDeveloperInfoId)) {
        errorMessage.message = "The developer has not a related developer info";

        return res.status(400).send(errorMessage);
      }
    } else {
      if (updatedDeveloperInfoId !== null) {
        errorMessage.message =
          "The developer already has a related developer info";

        return res.status(400).send(errorMessage);
      }
    }

    req.developerInfoId = updatedDeveloperInfoId;

    next();
  };

  export const checkDateFormat = (
    req: Request,
    res: Response,
    next: NextFunction,
    dateProperty: string
  ) => {
    const dateRegex = /^\d{4}\/\d{2}\/\d{2}$/;
    const hasRightDateFormat = dateRegex.test(req.body[dateProperty]);

    if (!hasRightDateFormat) {
      const errorMessage: iMessage = {
        message: `The property ${dateProperty} should have the format: 0000/00/00`,
      };

      return res.status(400).send(errorMessage);
    }

    req.body[dateProperty] = new Date(req.body[dateProperty]);

    next();
  };

  export const checkDeveloperDateFormat = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (req.body.developerSince) {
      checkDateFormat(req, res, next, "developerSince");
    } else {
      return next();
    }
  };

  export const checkTechnologyDateFormat = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (req.body.addedIn) {
      checkDateFormat(req, res, next, "addedIn");
    } else {
      req.body.addedIn = new Date(Date.now());
      return next();
    }
  };

  export const checkProjectStartDateFormat = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (req.body.startDate) {
      checkDateFormat(req, res, next, "startDate");
    } else {
      next();
    }
  };

  export const checkProjectEndDateFormat = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (req.body.endDate) {
      checkDateFormat(req, res, next, "endDate");
    } else {
      next();
    }
  };

  export const checkpreferredOS = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.body.preferredOS && req.method === "PATCH") {
      return next();
    }

    const preferredOS = req.body.preferredOS + "";

    let formattedOs = (preferredOS[0] || "").toUpperCase();
    formattedOs +=
      preferredOS.toLowerCase() === "macos"
        ? preferredOS.substring(1, 3).toLowerCase() +
          preferredOS.substring(3).toUpperCase()
        : preferredOS.substring(1).toLowerCase();

    const isAValidOs = os.includes(formattedOs);

    if (!isAValidOs) {
      const errorMessage: iMessage = {
        message: "Invalid OS option.",
        options: os,
      };

      return res.status(400).send(errorMessage);
    }

    req.body.preferredOS = formattedOs;

    next();
  };

  export const parseId = (req: Request, _: Response, next: NextFunction) => {
    const developerId = parseInt(req.params.id);
    req.parsedId = isNaN(developerId) ? -1 : developerId;

    next();
  };

  export const storeBodyDeveloperId = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const developerId = req.body.developerId;

    if (developerId) {
      req.parsedId = developerId;

      checkIfDeveloperExists(req, res, next);
    } else {
      next();
    }
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

  export const checkIfProjectExists = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const projectId = req.parsedId;

    const foundProject = await database.getProjects(projectId);

    if (foundProject.length === 0) {
      const errorMessage: iMessage = {
        message: "Project not found.",
      };

      return res.status(404).send(errorMessage);
    }

    next();
  };

  export const checkTechnologyName = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { body, params } = req;
    let insertedTechnology: string;

    if (params.name) {
      insertedTechnology = params.name;
    } else {
      insertedTechnology = body.name;
    }

    const availablesTechnologies = (await database.getTechnologies()).map(
      (technology) => technology.name.toLowerCase()
    );

    req.availablesTechnologies = availablesTechnologies;

    if (!availablesTechnologies.includes(insertedTechnology.toLowerCase())) {
      const errorMessage: iMessage = {
        message: "Technology not supported.",
        options: availablesTechnologies,
      };

      return res.status(400).send(errorMessage);
    }

    const foundTechnology = await database.getTechnologies(insertedTechnology);

    req.technologyId = foundTechnology[0].id;

    next();
  };

  export const checkIfProjectHasTechnology = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const technologyName = req.params.name;

    const projectsTechnologiesIds =
      await database.getProjectsTechnologiesWithIds(
        req.parsedId,
        req.technologyId
      );

    const hasTechnology = projectsTechnologiesIds.length > 0;

    const errorMessage: iMessage = { message: "" };

    if (req.method === "POST" && hasTechnology) {
      const technologyName = req.body.name;
      errorMessage.message = `Technology ${technologyName} is already on this Project.`;

      return res.status(409).send(errorMessage);
    } else if (req.method === "DELETE" && !hasTechnology) {
      errorMessage.message = `Technology ${technologyName} not found on this Project.`;

      return res.status(400).send(errorMessage);
    } else if (req.method === "DELETE") {
      req.projectTechnologyId = projectsTechnologiesIds[0].id;
    }

    next();
  };
}
