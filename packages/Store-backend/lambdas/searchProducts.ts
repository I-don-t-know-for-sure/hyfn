export const searchProductsHandler = async ({ arg, client }: MainFunctionProps) => {
  var result;
  const { value: searchValue, country, storeId } = arg[0];
  const agg = [
    {
      $search: {
        compound: {
          filter: [
            {
              text: {
                query: storeId,
                path: 'storeId',
              },
            },
          ],
          should: [
            {
              autocomplete: {
                query: searchValue,
                path: 'textInfo',
                fuzzy: { maxEdits: 1, prefixLength: 1, maxExpansions: 256 },
                score: { boost: { value: 3 } },
              },
            },
          ],
        },
      },
    },
    {
      $limit: 10,
    },
    {
      $project: {
        _id: 1,
        textInfo: 1,
      },
    },
  ];
  const coll = client.db('base').collection('products');
  result = await coll.aggregate(agg).toArray();
  return result;
};
interface SearchProductsProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
('use strict');
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
export const handler = async (event, ctx) => {
  return await mainWrapper({ event, ctx, mainFunction: searchProductsHandler });
};
