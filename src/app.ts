import { middlewares } from "../src/callbacks/middlewares";
import { requests } from "../src/callbacks/requests";
import { database } from "./database";

const express = require("express");

const api = express();

api.use(express.json());

api.use("/:id", middlewares.parseId);

api.post(
  "/developers",
  middlewares.checkDeveloperKeys,
  middlewares.storeDeveloperOnlyWithRightKeys,
  middlewares.checkDeveloperTypes,
  middlewares.checkNotUniqueEmail,
  requests.createDeveloper
);

api.get("/developers", requests.getDevelopers);
api.get("/developers/:id", requests.getDevelopers);

api.listen(3000, async () => {
  await database.connection.connect();

  console.log("The API is working :))");
});
