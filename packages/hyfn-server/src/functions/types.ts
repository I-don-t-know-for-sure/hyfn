import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { MongoClient } from "mongodb";

export interface MainFunctionProps {
  arg: any[];
  event: any;
  client: MongoClient;
  userId: string;
  accessToken?: any;
  session?: any;
  ctx?: any;
  callback?: any;
  db?: NodePgDatabase;
}

export interface MainWrapperProps {
  event: any;
  mainFunction: (props: MainFunctionProps) => Promise<any>;
  withUserDocument?: boolean;
  validateUser?: boolean;
  projection?: any;
  sessionPrefrences?: any;
  ctx?: any;
  callback?: any;
}

// export interface mainWrapperWithSessionProps {
//   event: any;
//   mainFunction: (props: MainFunctionProps) => Promise<any>;
//   withUserDocument?: boolean;
//   validateUser?: boolean;
//   projection?: any;
//   sessionPrefrences?: any

// }
