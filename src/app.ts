import { middlewares } from "../src/callbacks/middlewares";
import { database } from "./database";

const express = require("express");

const api = express();

api.use(express.json());

api.post(
  "/developers",
  database.createDeveloper,
  middlewares.checkDeveloperKeys,
  middlewares.checkDeveloperTypes,
  middlewares.checkNotUniqueEmail
);

api.listen(3000, () => {
  console.log("The API is working :))");
});
