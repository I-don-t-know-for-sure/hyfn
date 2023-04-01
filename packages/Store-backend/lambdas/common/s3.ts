interface S3Props extends Omit<MainFunctionProps, "arg"> {
  // Add your interface properties here
}
import {S3} from "aws-sdk";
export const s3 = new S3();
