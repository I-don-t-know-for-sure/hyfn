import { randomId } from "@mantine/hooks";

import { useUser } from "contexts/userContext/User";

import { useInfiniteQuery, useMutation, useQuery } from "react-query";

export const useGetPendingOrders = () => {
  const { userId, userDocument } = useUser();

  return useQuery("Orders", async () => {
    try {
      const data = await fetch(
        "https://7ltn6iki5dgh52s7geukwa4qse0eujsb.lambda-url.eu-south-1.on.aws/",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify([
            { ...(userDocument?.storeDoc as {}), status: "not confirmed" },
          ]),
        }
      );
      const result = await data.json();

      return result;
    } catch (e) {
      console.error(e);
    }
  });
};
