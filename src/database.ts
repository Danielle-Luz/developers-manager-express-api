import { format } from "node-pg-format";
import { Client, QueryResult } from "pg";
import {
  iCount,
  iDeveloper,
  iDeveloperInfo,
  iDeveloperJoinDeveloperInfo,
  iId,
  iProjectJoinTechnologies,
  iTechnology,
  tDeveloperProjects,
} from "./interfaces";
import "dotenv/config";

export namespace database {
  export const connection = new Client({
    user: process.env.USER,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    database: process.env.DATABASE,
    port: parseInt(process.env.PORT || "5432"),
  });

  export const getDevelopersCountByEmail = async (email: string) => {
    const queryString = "SELECT COUNT(*) FROM developers WHERE email = %L";

    const queryResult: QueryResult<iCount> = await connection.query(
      format(queryString, email)
    );

    return queryResult.rows[0];
  };

  export const createRegister = async (
    newRegister: iDeveloper | iDeveloperInfo,
    table: string
  ) => {
    const newRegisterKeys = Object.keys(newRegister);
    const newRegisterValues = Object.values(newRegister);

    const queryString = `
    INSERT INTO %I (%I)
    VALUES (%L)
    RETURNING *
    `;

    const queryResult: QueryResult<iDeveloper> = await connection.query(
      format(queryString, table, newRegisterKeys, newRegisterValues)
    );

    return queryResult.rows[0];
  };

  export const updateRegister = async (
    tableName: string,
    registerId: number | undefined,
    updatedData: iDeveloperInfo | iDeveloper | iId
  ) => {
    const dataKeys = Object.keys(updatedData);
    const dataValues = Object.values(updatedData);

    const queryString = `
    UPDATE %I
    SET (%I) = ROW(%L)
    WHERE id = %L
    RETURNING *
    `;

    const updatedDataResult = await connection.query(
      format(queryString, tableName, dataKeys, dataValues, registerId)
    );

    return updatedDataResult.rows[0];
  };

  export const createDeveloperInfo = async (
    developerId: number,
    newDeveloperInfo: iDeveloperInfo
  ) => {
    const createdDeveloperInfo = await createRegister(
      newDeveloperInfo,
      "developerInfos"
    );
    const developerInfoId = createdDeveloperInfo.id;

    const developerIdObject: iId = { developerId: developerId };
    const developerInfoIdObject: iId = { developerInfoId: developerInfoId };

    await updateRegister("developers", developerId, developerInfoIdObject);
    const updatedDeveloperInfo = await updateRegister(
      "developerInfos",
      developerInfoId,
      developerIdObject
    );

    return updatedDeveloperInfo;
  };

  export const getDevelopers = async (id?: number) => {
    let queryString = `
    SELECT 
    di.id AS "developerInfoID", 
    "developerSince" AS "developerInfoDeveloperSince",
    "preferredOs" AS "developerInfoPreferredOS",
    d.id AS "developerID",
    "name" AS "developerName",
    email AS "developerEmail"
    FROM developers d
    LEFT JOIN "developerInfos" di
    ON d.id = di."developerId"
    `;

    if (id || id === 0) {
      queryString += "WHERE d.id = %L";

      queryString = format(queryString, id);
    }

    const queryResult: QueryResult<iDeveloperJoinDeveloperInfo> =
      await connection.query(queryString);

    return queryResult.rows;
  };

  export const getProjects = async (id?: number, developerId?: number) => {
    let queryString = `
    SELECT
    p.id as "projectID",
    p.name as "projectName",
    p.description as "projectDescription",
    p."estimatedTime" as "projectEstimatedTime",
    p.repository as "projectRepository",
    p."startDate" as "projectStartDate",
    p."endDate" as "projectEndDate",
    p."developerId" as "projectDeveloperID",
    t.id as "technologyID",
    t.name as "technologyName"
    FROM projects p
    LEFT JOIN "projectsTechnologies" pt
    ON "projectId" = p.id
    LEFT JOIN technologies t
    ON "technologyId" = t.id
    `;

    if (id || id === 0) {
      queryString += "WHERE p.id = %L";

      queryString = format(queryString, id);
    }

    const queryResult: QueryResult<iProjectJoinTechnologies> =
      await connection.query(queryString);

    return queryResult.rows;
  };

  export const getDeveloperProjects = async (developerId: number) => {
    let queryString = `
    SELECT
    d.id AS "developerID",
    d."name" AS "developerName",
    email AS "developerEmail",
    di.id AS "developerInfoID", 
    "developerSince" AS "developerInfoDeveloperSince",
    "preferredOs" AS "developerInfoPreferredOS",
    p.id as "projectID",
    p.name as "projectName",
    p.description as "projectDescription",
    p."estimatedTime" as "projectEstimatedTime",
    p.repository as "projectRepository",
    p."startDate" as "projectStartDate",
    p."endDate" as "projectEndDate",
    p."developerId" as "projectDeveloperID",
    t.id as "technologyID",
    t.name as "technologyName"
    FROM projects p
    INNER JOIN developers d
    ON p."developerId" = d.id
    LEFT JOIN "developerInfos" di
    ON d.id = di."developerId"
    LEFT JOIN "projectsTechnologies" pt
    ON "projectId" = p.id
    LEFT JOIN technologies t
    ON "technologyId" = t.id
    WHERE p."developerId" = %L
    `;

    queryString = format(queryString, developerId);

    const queryResult: QueryResult<tDeveloperProjects> = await connection.query(
      queryString
    );

    return queryResult.rows;
  };

  export const getTechnologies = async (technologyName?: string) => {
    let queryString = `
    SELECT * FROM technologies
    `;

    if (technologyName) {
      queryString += 'WHERE LOWER("name") = LOWER(%L)';

      queryString = format(queryString, technologyName);
    }

    const queryResult: QueryResult<iTechnology> = await connection.query(
      queryString
    );

    return queryResult.rows;
  };

  export const getProjectsTechnologiesWithIds = async (
    projectId: number,
    technologyId: number | undefined
  ) => {
    const queryString = `
    SELECT id
    FROM "projectsTechnologies"
    WHERE "projectId" = %L AND "technologyId" = %L;
    `;

    const queryResult: QueryResult<iId> = await connection.query(
      format(queryString, projectId, technologyId)
    );

    return queryResult.rows;
  };

  export const deleteData = async (
    table: string,
    deletedColumn: string,
    deletedDataId: number | undefined
  ) => {
    const queryString = `
    DELETE FROM %I
    WHERE %I = %L
    `;

    await connection.query(
      format(queryString, table, deletedColumn, deletedDataId)
    );
  };
}
