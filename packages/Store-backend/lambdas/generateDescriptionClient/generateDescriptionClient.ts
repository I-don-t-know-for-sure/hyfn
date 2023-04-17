import { MainFunctionProps, mainWrapper } from 'hyfn-server';

import { generateProductDescription } from '../common/functions/generateProductDescription';

interface GenerateDescriptionClientProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any[];
}

export const generateDescriptionClientHandler = async ({
  arg,
  userId,
  client,
}: GenerateDescriptionClientProps) => {
  console.log('🚀 ~ file: generateDescriptionClient.ts:14 ~ arg:', arg);
  // console.log('🚀 ~ file: generateDescriptionClient.ts:15 ~ userId:', userId);
  try {
    generateProductDescription({ arg });
  } catch (error) {
    console.log('🚀 ~ file: generateDescriptionClient.ts:17 ~ error:', error);
    throw new Error('error');
  }
  return 'success';
};

export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: generateDescriptionClientHandler });
};
