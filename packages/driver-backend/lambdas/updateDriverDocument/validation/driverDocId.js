import { array, object, string } from 'yup';

export const driverDocIdSchema = string().required().strict();
