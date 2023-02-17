import {
  iDeveloper,
  iDeveloperJoinDeveloperInfo,
  iProjectJoinTechnologies,
} from "./../interfaces";
import { Request, Response } from "express";
import { database } from "../database";
import { iMessage } from "../interfaces";

export namespace requests {
  const createRegister = async (
    req: Request,
    res: Response,
    table: string,
    hasSelectReturn?: boolean
  ) => {
    const { body: newRegister } = req;

    try {
      const createdRegister = await database.createRegister(newRegister, table);

      if (!hasSelectReturn) {
        return res.status(201).send(createdRegister);
      } else {
        return createdRegister;
      }
    } catch (error) {
      const errorObject = error as Error;

      const errorMessage: iMessage = {
        message: "Failed to insert the data in the database",
      };

      console.error(errorObject.stack);

      return res.status(500).send(errorMessage);
    }
  };

  export const createDeveloper = async (req: Request, res: Response) => {
    await createRegister(req, res, "developers");
  };

  export const insertTechnologyInProject = async (
    req: Request,
    res: Response
  ) => {
    const projectId = req.parsedId;
    
    req.body = {
      projectId: req.parsedId,
      technologyId: req.technologyId,
      addedIn: req.body.addedIn,
    };
    
    const createdProjectTechnology = (await createRegister(
      req,
      res,
      "projectsTechnologies",
      true
      )) as iDeveloper;

    const technologyWithProject = 
      await database.getProjects(undefined, undefined, true, createdProjectTechnology.id)
    ;
      
    return res.status(201).send(technologyWithProject);
  };

  export const createDeveloperInfos = async (req: Request, res: Response) => {
    const { body: newDeveloperInfo } = req;
    const developerId = req.parsedId;

    try {
      const createdDeveloperInfo = await database.createDeveloperInfo(
        developerId,
        newDeveloperInfo
      );

      return res.status(201).send(createdDeveloperInfo);
    } catch (error) {
      const errorObject = error as Error;

      const errorMessage: iMessage = {
        message: "Failed to insert the developer info in the database",
      };

      console.error(errorObject.stack);

      return res.status(500).send(errorMessage);
    }
  };

  export const createProject = async (req: Request, res: Response) => {
    await createRegister(req, res, "projects");
  };

  export const updateData = async (
    req: Request,
    res: Response,
    tableName: string
  ) => {
    const { body: updatedData } = req;
    const updatedDataId = req.parsedId;

    try {
      const updatedDataResult = await database.updateRegister(
        tableName,
        updatedDataId,
        updatedData
      );

      return res.status(200).send(updatedDataResult);
    } catch (error) {
      const errorObject = error as Error;

      const errorMessage: iMessage = {
        message: "Failed to update the data",
      };

      console.error(errorObject.stack);

      return res.status(500).send(errorMessage);
    }
  };

  export const updateDeveloper = async (req: Request, res: Response) => {
    await updateData(req, res, "developers");
  };

  export const updateDeveloperInfo = async (req: Request, res: Response) => {
    req.parsedId = req.developerInfoId;

    return await updateData(req, res, "developerInfos");
  };

  export const updateProject = async (req: Request, res: Response) => {
    return await updateData(req, res, "projects");
  };

  export const getDevelopers = async (req: Request, res: Response) => {
    const developerId = req.parsedId;
    const hasId = developerId || developerId === 0;

    try {
      const allDevelopersList: iDeveloperJoinDeveloperInfo[] = hasId
        ? await database.getDevelopers(developerId)
        : await database.getDevelopers();

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

  export const getProjects = async (req: Request, res: Response) => {
    const projectId = req.parsedId;
    const hasId = projectId || projectId === 0;

    try {
      const allProjectsList: iProjectJoinTechnologies[] = hasId
        ? await database.getProjects(projectId)
        : await database.getProjects();

      return res.status(200).send(allProjectsList);
    } catch (error) {
      const errorMessage: iMessage = {
        message: "Failed to get projects data in the database",
      };

      const errorObject = error as Error;

      console.error(errorObject.stack);

      return res.status(500).send(errorMessage);
    }
  };

  export const getDeveloperProjects = async (req: Request, res: Response) => {
    const developerId = req.parsedId;

    try {
      const developerProjects = await database.getDeveloperProjects(
        developerId
      );

      return res.status(200).send(developerProjects);
    } catch (error) {
      const errorMessage: iMessage = {
        message: "Failed to get developer's projects data in the database",
      };

      const errorObject = error as Error;

      console.error(errorObject.stack);

      return res.status(500).send(errorMessage);
    }
  };

  export const deleteDeveloper = async (req: Request, res: Response) => {
    try {
      await database.deleteData("developers", "id", req.parsedId);

      return res.status(204).send();
    } catch (error) {
      const errorMessage: iMessage = {
        message: "Failed to delete developer from the database",
      };

      const errorObject = error as Error;

      console.error(errorObject.stack);

      return res.status(500).send(errorMessage);
    }
  };

  export const deleteProject = async (req: Request, res: Response) => {
    try {
      await database.deleteData("projects", "id", req.parsedId);

      return res.status(204).send();
    } catch (error) {
      const errorMessage: iMessage = {
        message: "Failed to delete project from the database",
      };

      const errorObject = error as Error;

      console.error(errorObject.stack);

      return res.status(500).send(errorMessage);
    }
  };

  export const deleteProjectTechnology = async (
    req: Request,
    res: Response
  ) => {
    try {
      await database.deleteData(
        "projectsTechnologies",
        "id",
        req.projectTechnologyId
      );

      return res.status(204).send();
    } catch (error) {
      const errorMessage: iMessage = {
        message:
          "Failed to delete project-technology relation from the database",
      };

      const errorObject = error as Error;

      console.error(errorObject.stack);

      return res.status(500).send(errorMessage);
    }
  };
}
