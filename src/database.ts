import { format } from "node-pg-format";
import { Client, QueryResult } from "pg";
import { iCount, iDeveloper } from "./interfaces";

export namespace database {
  const connection = new Client({
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

  export const createDeveloper = async (newDeveloperData: iDeveloper) => {
    const newDeveloperDataKeys = Object.keys(newDeveloperData);
    const newDeveloperDataValues = Object.values(newDeveloperData);

    const queryString = `
    INSERT INTO developers (%I)
    VALUES (%L)
    RETURNING *
    `;

    const queryResult: QueryResult<iDeveloper> = await connection.query(
      format(queryString, newDeveloperDataKeys, newDeveloperDataValues)
    );

    return queryResult.rows[0];
  };
}
