import { middlewares } from "../src/callbacks/middlewares";
import { requests } from "../src/callbacks/requests";
import { database } from "./database";

const express = require("express");

const api = express();

api.use(express.json());

api.post(
  "/developers",
  middlewares.checkCreateDeveloperKeys,
  middlewares.storeDeveloperOnlyWithRightKeys,
  middlewares.checkDeveloperTypes,
  middlewares.checkNotUniqueEmail,
  requests.createDeveloper
);

api.post(
  "/developers/:id/infos",
  middlewares.checkCreateDeveloperInfoKeys,
  middlewares.checkDeveloperDateFormat,
  middlewares.storeDeveloperInfoOnlyWithRightKeys,
  middlewares.checkpreferredOS,
  middlewares.parseId,
  middlewares.checkIfDeveloperExists,
  middlewares.checkIfDeveloperHasInfo,
  requests.createDeveloperInfos
);

api.post(
  "/projects",
  middlewares.checkProjectKeys,
  middlewares.checkProjectStartDateFormat,
  middlewares.checkProjectEndDateFormat,
  middlewares.storeProjectOnlyWithRightKeys,
  middlewares.checkProjectTypes,
  middlewares.storeBodyDeveloperId,
  requests.createProject
);

api.post(
  "/projects/:id/technologies",
  middlewares.parseId,
  middlewares.checkTechnologiesKeys,
  middlewares.storeTechnologiesOnlyWithRightKeys,
  middlewares.checkTechnologyDateFormat,
  middlewares.checkTechnologiesTypes,
  middlewares.checkTechnologyName,
  middlewares.checkIfProjectExists,
  middlewares.checkIfProjectHasTechnology,
  requests.insertTechnologyInProject
);

api.patch(
  "/developers/:id",
  middlewares.parseId,
  middlewares.checkIfDeveloperExists,
  middlewares.checkEmptyDeveloperKeys,
  middlewares.storeDeveloperOnlyWithRightKeys,
  middlewares.checkDeveloperTypes,
  middlewares.checkNotUniqueEmail,
  requests.updateDeveloper
);

api.patch(
  "/projects/:id",
  middlewares.checkEmptyProjectKeys,
  middlewares.storeBodyDeveloperId,
  middlewares.parseId,
  middlewares.checkProjectStartDateFormat,
  middlewares.checkProjectEndDateFormat,
  middlewares.storeProjectOnlyWithRightKeys,
  middlewares.checkProjectTypes,
  requests.updateProject
);

api.patch(
  "/developers/:id/infos",
  middlewares.parseId,
  middlewares.checkIfDeveloperExists,
  middlewares.checkEmptyDeveloperInfoKeys,
  middlewares.checkDeveloperDateFormat,
  middlewares.storeDeveloperInfoOnlyWithRightKeys,
  middlewares.checkpreferredOS,
  middlewares.checkIfDeveloperHasInfo,
  requests.updateDeveloperInfo
);

api.get("/developers", requests.getDevelopers);

api.get(
  "/developers/:id",
  middlewares.parseId,
  middlewares.checkIfDeveloperExists,
  requests.getDevelopers
);

api.get("/projects", requests.getProjects);

api.get(
  "/projects/:id",
  middlewares.parseId,
  middlewares.checkIfProjectExists,
  requests.getProjects
);

api.get(
  "/developers/:id/projects",
  middlewares.parseId,
  middlewares.checkIfDeveloperExists,
  requests.getDeveloperProjects
);

api.delete(
  "/developers/:id",
  middlewares.parseId,
  middlewares.checkIfDeveloperExists,
  requests.deleteDeveloper
);

api.delete(
  "/projects/:id",
  middlewares.parseId,
  middlewares.checkIfProjectExists,
  requests.deleteProject
);

api.delete(
  "/projects/:id/technologies/:name",
  middlewares.parseId,
  middlewares.checkIfProjectExists,
  middlewares.checkTechnologyName,
  middlewares.checkIfProjectHasTechnology,
  requests.deleteProjectTechnology
);

api.listen(3000, async () => {
  await database.connection.connect();

  console.log("The API is working :))");
});
