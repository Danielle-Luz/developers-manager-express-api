import { Request } from "express";
import { iDeveloperJoinDeveloperInfo } from "../../interfaces";

declare global {
  namespace Express {
    interface Request {
      parsedId: number;
      foundDeveloper: iDeveloperJoinDeveloperInfo;
      developerInfoId: number;
    }
  }
}