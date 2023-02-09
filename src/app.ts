import { middlewares } from "../src/callbacks/middlewares";
import { requests } from "../src/callbacks/requests";
import { database } from "./database";

const express = require("express");

const api = express();

api.use(express.json());

api.post(
  "/developers",
  middlewares.checkDeveloperKeys,
  middlewares.storeDeveloperOnlyWithRightKeys,
  middlewares.checkDeveloperTypes,
  middlewares.checkNotUniqueEmail,
  requests.createDeveloper
);
api.post(
  "/developers/:id/infos",
  middlewares.checkDeveloperInfoKeys,
  middlewares.storeDeveloperInfoOnlyWithRightKeys,
  middlewares.checkDeveloperInfoTypes,
  middlewares.checkIfDeveloperExists,
  requests.createDeveloperInfos
);

api.get("/developers", requests.getDevelopers);
api.get(
  "/developers/:id",
  middlewares.parseId,
  middlewares.checkIfDeveloperExists,
  requests.getDevelopers
);

api.listen(3000, async () => {
  await database.connection.connect();

  console.log("The API is working :))");
});
