interface IndexProps extends Omit<MainFunctionProps, "arg"> {
  // Add your interface properties here
}
import { getStoreFronts } from './getStoreFronts/getStoreFronts';

type LambdaHandlers = {
  createOrderData: {
    arg: Parameters<typeof getStoreFronts>['0']['arg'];
    return: { name: string };
  };
};

type CustomerFunction<T extends keyof LambdaHandlers> = (
  arg: LambdaHandlers[T]['arg']
) => Promise<LambdaHandlers[T]['return']>;

export const callAPI = async <T extends keyof LambdaHandlers>({
  arg,
  url,
}: {
  url: T;
  arg: Parameters<CustomerFunction<T>>['0'];
}): Promise<ReturnType<CustomerFunction<T>>> => {
  // ...
  return;
};

// This will not throw a compilation error because the type of `arg` matches
// the type required by the `url` property.
callAPI({
  url: 'createOrderData',
  arg: '',
});
