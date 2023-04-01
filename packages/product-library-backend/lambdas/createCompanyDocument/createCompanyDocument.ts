export const createCompanyDocumentHandler = async ({
  arg,
  client,
  session,
}: MainFunctionProps) => {
  var result;
  const mongo = client;
  const companyInfo = arg[0];
  console.log(JSON.stringify(companyInfo));
  const companyName = companyInfo.companyName;
  const companyType = companyInfo.companyType.includes("Restaurant")
    ? ["Restaurant"]
    : companyInfo.companyType;
  const companyPhone = companyInfo.companyPhone;
  const country = companyInfo.country;
  const city = companyInfo.city;
  const { id: userId, coords, ...rest } = companyInfo;
  console.log(coords);
  // const { accessToken } = arg[arg.length - 1];
  // await mainValidateFunction(client, accessToken, userId);
  // Step 2: Optional. Define options to use for the transaction
  // Step 3: Use withTransaction to start a transaction, execute the callback, and commit (or abort on error)
  // Note: The callback for withTransaction MUST be async and/or return a Promise.
  //    const isIndexed = await client.db("base").collection("companys").findOne({_id: 'collectionInfo'})
  // const companyFronts = await mongo
  //   .db("base")
  //   .collection(`companyFronts`);
  const customUserData = await mongo
    .db("generalData")
    .collection("companyInfo");
  const coordsArray = coords.split(",");
  console.log(JSON.stringify(coordsArray));
  if (Array.isArray(coordsArray)) {
    if (coordsArray.length === 2) {
      const float1 = parseFloat(coordsArray[0]);
      const float2 = parseFloat(coordsArray[1]);
      console.log(JSON.stringify(coordsArray));
      const coords = { type: "Point", coordinates: [float2, float1] };
      // const newcompanyDoc = await companyFronts.insertOne(
      //   {
      //     companyType,
      //     companyPhone,
      //     companyName,
      //     image: "",
      //     description: companyInfo.description,
      //     country,
      //     city: "gibrish",
      //     opened: false,
      //     coords,
      //     ratingCount: 0,
      //     currentRatingTotal: 0,
      //     currentRating: 0,
      //   },
      //   { session }
      // );
      const newId = new ObjectId();
      await customUserData.insertOne({
        _id: newId,
        userId: userId,
        companyDoc: {
          id: newId.toString(),
          country: country,
          city: city,
        },
        ...rest,
        coords,
        image: "",
      });
    } else {
      result = new Error("coords array length must equal to 2");
      throw new Error("wrong");
    }
  }
  //console.log(JSON.stringify({businessName,businessPhone, businessType,country, city, tags: [], collections: [],  image:''}))
};
interface CreateCompanyDocumentProps extends Omit<MainFunctionProps, "arg"> {}
("use strict");
import { MainFunctionProps, mainWrapperWithSession } from "hyfn-server";
import { ObjectId } from "mongodb";
export const handler = async (event, ctx) => {
  return await mainWrapperWithSession({
    event,
    ctx,
    mainFunction: createCompanyDocumentHandler,
    sessionPrefrences: {
      readPreference: "primary",
      readConcern: { level: "local" },
      writeConcern: { w: "majority" },
    },
  });
};
