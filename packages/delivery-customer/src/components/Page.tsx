import { Box, Loader } from "@mantine/core";
import { useUser } from "../contexts/userContext/User";

function Page({ children }: { children: JSX.Element }) {
  const { loggedIn, isLoading } = useUser();

  return isLoading ? (
    <Loader />
  ) : (
    <Box mt={6} mb={6}>
      {children}
    </Box>
  );
}

export default Page;
