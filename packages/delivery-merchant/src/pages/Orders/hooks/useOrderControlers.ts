import { randomId } from "@mantine/hooks";

import { useUser } from "contexts/userContext/User";
import { t } from "utils/i18nextFix";
import { useInfiniteQuery, useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router";

import fetchUtil from "utils/fetch";

export const useOrderControlers = () => {
  const { userId, userDocument } = useUser();

  return useMutation("Orders", async (orderId: string) => {
    try {
      // https://jrjtsu634ccvyllh523gnnyzoa0knerr.lambda-url.eu-south-1.on.aws/
      await fetchUtil({
        url: "https://jrjtsu634ccvyllh523gnnyzoa0knerr.lambda-url.eu-south-1.on.aws/",
        reqData: [userDocument?.storeDoc, orderId],
      });
    } catch (e) {
      console.error(e);
    }
  });
};
