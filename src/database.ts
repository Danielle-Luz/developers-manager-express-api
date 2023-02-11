import { format } from "node-pg-format";
import { Client, QueryResult } from "pg";
import {
  iCount,
  iDeveloper,
  iDeveloperInfo,
  iDeveloperJoinDeveloperInfo,
  iId,
  iProjectJoinTechnologies,
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
      "developer_infos"
    );
    const developerInfoId = createdDeveloperInfo.id;

    const developerIdObject: iId = { developer_id: developerId };
    const developerInfoIdObject: iId = { developer_info_id: developerInfoId };

    await updateRegister("developers", developerId, developerInfoIdObject);
    const updatedDeveloperInfo = await updateRegister(
      "developer_infos",
      developerInfoId,
      developerIdObject
    );

    return updatedDeveloperInfo;
  };

  export const getDevelopers = async (id?: number) => {
    let queryString = `
    SELECT 
    di.id AS "developerInfoID", 
    developer_since AS "developerInfoDeveloperSince",
    preferred_os AS "developerInfoPreferredOS",
    d.id AS "developerID",
    "name" AS "developerName",
    email AS "developerEmail"
    FROM developers d
    LEFT JOIN developer_infos di
    ON d.id = di.developer_id
    `;

    if (id || id === 0) {
      queryString += "WHERE d.id = %L";

      queryString = format(queryString, id);
    }

    const queryResult: QueryResult<iDeveloperJoinDeveloperInfo> =
      await connection.query(queryString);

    return queryResult.rows;
  };

  export const getProjects = async (id?: number) => {
    let queryString = `
    SELECT
    p.id as "projectID",
    p.name as "projectName",
    p.description as "projectDescription",
    p.estimated_time as "projectEstimatedTime",
    p.repository as "projectRepository",
    p.start_date as "projectStartDate",
    p.end_date as "projectEndDate",
    p.developer_id as "projectDeveloperID",
    t.id as "technologyID",
    t.name as "technologyName"
    FROM projects p
    LEFT JOIN projects_technologies pt
    ON project_id = p.id
    LEFT JOIN technologies t
    ON technology_id = t.id
    `;

    if (id || id === 0) {
      queryString += "WHERE p.id = %L";

      queryString = format(queryString, id);
    }

    const queryResult: QueryResult<iProjectJoinTechnologies> =
      await connection.query(queryString);

    return queryResult.rows;
  };

  export const deleteData = async (
    table: string,
    deletedColumn: string,
    deletedDataId: number
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
