import { MainFunctionProps, mainWrapper } from 'hyfn-server';

interface CaneclTransactionProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}

export const cancelTransaction = async ({}: CaneclTransactionProps) => {};

export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: cancelTransaction });
};
