import { object, string } from 'yup';

export const driverInfoSchema = object({
  driverName: string().required(),
  // fatherName: string().required(),
  driverPhone: string().required(),
  // lastName: string().required(),
  tarnsportationMethod: string().required(),
}).noUnknown();
