const express = require("express");

const api = express();

api.listen(3000, () => {
  console.log("The API is working :))");
});