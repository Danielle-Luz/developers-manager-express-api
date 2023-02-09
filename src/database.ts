import { Client, QueryResult } from "pg";
import { iDeveloper } from "./interfaces";

export namespace database {
  const connection = new Client({
    user: process.env.USER,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    database: process.env.DATABASE,
    port: parseInt(process.env.PORT || "5432")
  });

  export const getDatabaseByEmail = (email: string) => {
    const queryString = "SELECT * FROM developers WHERE email = %L";

    //const queryResult: QueryResult<iDeveloper> = 
  };
}
