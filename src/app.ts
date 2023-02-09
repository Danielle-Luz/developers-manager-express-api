import { middlewares } from "../src/callbacks/middlewares";

const express = require("express");

const api = express();

api.use(express.json());

api.post(
  "/developers",
  middlewares.checkDeveloperKeys,
  middlewares.checkDeveloperTypes
);

api.listen(3000, () => {
  console.log("The API is working :))");
});
