import { Navigate, useLocation } from "react-router";
import { useUser } from "../contexts/userContext/User";

function RequireAuth({ children }: { children: JSX.Element }) {
  const { loggedIn } = useUser();
  const location = useLocation();

  if (!loggedIn) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/signup" state={location} replace />;
  }

  return children;
}

export default RequireAuth;
