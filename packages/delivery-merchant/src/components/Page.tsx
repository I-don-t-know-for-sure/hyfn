import { Box, Loader } from "@mantine/core";
import { useUser } from "contexts/userContext/User";

function Page({ children }: { children: JSX.Element }) {
  const { userDocument: user, isLoading, loggedIn } = useUser();

  return isLoading && !user ? (
    <Loader />
  ) : (
    <Box mt={6} mb={6}>
      {children}
    </Box>
  );
}

export default Page;
