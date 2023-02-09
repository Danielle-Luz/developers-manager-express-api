import { format } from "node-pg-format";
import { Client, QueryResult } from "pg";
import {
  iCount,
  iDeveloper,
  iDeveloperInfo,
  iDeveloperJoinDeveloperInfo,
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

  export const createDeveloperInfo = async (
    developerId: number,
    newDeveloperInfo: iDeveloperInfo,
  ) => {
    const createdDeveloperInfo = await createRegister(newDeveloperInfo, "developer_infos");
    const developerInfoId = createdDeveloperInfo.id;

    const queryString = `
    UPDATE %I
    SET %I = %L
    WHERE id = %L;
    `;

    await connection.query(
      format(
        queryString,
        "developers",
        "developer_info_id",
        developerInfoId,
        developerId
      )
    );

    await connection.query(
      format(
        queryString,
        "developer_infos",
        "developer_id",
        developerId,
        developerInfoId
      )
    );

    return createdDeveloperInfo;
  };

  export const getDevelopers = async (id?: number) => {
    let queryString = `
    SELECT 
    di.id AS developerInfoID, 
    developer_since AS developerInfoDeveloperSince,
    preferred_os AS developerInfoPreferredOS,
    d.id AS developerID,
    "name" AS developerName,
    email AS developerEmail
    FROM developers d
    LEFT JOIN developer_infos di
    ON d.id = di.id
    `;

    if (id || id === 0) {
      queryString += "WHERE d.id = %L";

      queryString = format(queryString, id);
    }

    const queryResult: QueryResult<iDeveloperJoinDeveloperInfo> =
      await connection.query(queryString);

    return queryResult.rows;
  };
}
