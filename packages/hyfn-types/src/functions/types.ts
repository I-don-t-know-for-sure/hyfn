import { MongoClient } from "mongodb";

export interface MainFunctionProps {
  arg: any[];
  event: any;
  client: MongoClient;
  userId: string;
}

export interface MainWrapperProps {
  event: any;
  mainFunction: (props: MainFunctionProps) => Promise<any>;
  withUserDocument?: boolean;
  validateUser?: boolean;
  projection?: any;
}
