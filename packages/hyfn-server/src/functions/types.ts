import { Kysely } from "kysely";
import { MongoClient } from "mongodb";

import { Database } from "../schemas";

export interface MainFunctionProps {
  arg: any[];
  event: any;
  client?: MongoClient;
  userId: string;
  accessToken?: any;
  session?: any;
  ctx?: any;
  callback?: any;

  db?: Kysely<Database>;
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
