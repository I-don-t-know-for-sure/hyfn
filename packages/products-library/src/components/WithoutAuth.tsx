import { useUser } from "contexts/userContext/User";
import { Navigate, useLocation } from "react-router";

function RequireAuth({ children }: { children: JSX.Element }) {
  const { loggedIn } = useUser();
  // let location = useLocation();

  if (loggedIn !== undefined || loggedIn !== null) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.

    return <Navigate to={"/"} replace />;
  }

  return children;
}

export default RequireAuth;
