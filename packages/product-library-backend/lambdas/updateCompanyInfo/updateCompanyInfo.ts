export const updateCompanyInfoHandler = async ({
  arg,
  client,
}: MainFunctionProps) => {
  var result;
  const { companyFrontId, id, city, country } = arg[0];
  const newInfo = arg[1];
  const { imgaeObj, ...newcompany } = newInfo;
  const mongo = client.db("base");
  const companyCollection = client.db("generalData").collection(`companyInfo`);
  const coordsArray = newcompany.coords.split(",");

  if (Array.isArray(coordsArray)) {
    if (coordsArray.length === 2) {
      const float1 = parseFloat(coordsArray[0]);
      const float2 = parseFloat(coordsArray[1]);

      const coords = { type: "Point", coordinates: [float2, float1] };
      await companyCollection.updateOne(
        { id: new ObjectId(id) },
        {
          $set: { ...newcompany, coords: coords },
        }
      );
    }
  }
  return result;
};
interface UpdateCompanyInfoProps extends Omit<MainFunctionProps, "arg"> {
  arg: any;
}
("use strict");
import { MainFunctionProps, mainWrapper } from "hyfn-server";
import { ObjectId } from "mongodb";
export const handler = async (event, ctx) => {
  return await mainWrapper({
    event,
    ctx,
    mainFunction: updateCompanyInfoHandler,
  });
};
