import { MainFunctionProps, mainWrapper } from 'hyfn-server';

import { generateProductDescription } from './common/functions/generateProductDescription';

interface GenerateDescriptionClientProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any[];
}

export const generateDescriptionClientHandler = async ({
  arg,
  userId,
  client,
}: GenerateDescriptionClientProps) => {
  try {
    generateProductDescription({ arg });
  } catch (error) {
    throw new Error('error');
  }
  return 'success';
};

export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: generateDescriptionClientHandler });
};
