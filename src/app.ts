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
  middlewares.storeDeveloperInfoOnlyWithRightKeys,
  middlewares.checkPreferredOs,
  middlewares.checkDeveloperDateFormat,
  middlewares.parseId,
  middlewares.checkIfDeveloperExists,
  middlewares.checkIfDeveloperHasInfo,
  requests.createDeveloperInfos
);

api.post(
  "/projects",
  middlewares.checkProjectKeys,
  middlewares.checkProjectDateFormat,
  middlewares.checkProjectTypes,
  middlewares.storeBodyDeveloperId,
  middlewares.storeProjectOnlyWithRightKeys,
  requests.createProject
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
  "/developers/:id/infos",
  middlewares.parseId,
  middlewares.checkIfDeveloperExists,
  middlewares.checkEmptyDeveloperInfoKeys,
  middlewares.storeDeveloperInfoOnlyWithRightKeys,
  middlewares.checkPreferredOs,
  middlewares.checkDeveloperDateFormat,
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

api.delete(
  "/developers/:id",
  middlewares.parseId,
  middlewares.checkIfDeveloperExists,
  requests.deleteDeveloper
);

api.listen(3000, async () => {
  await database.connection.connect();

  console.log("The API is working :))");
});
