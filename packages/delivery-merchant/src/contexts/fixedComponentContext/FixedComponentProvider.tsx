import { createContext, ReactNode, useContext, useState } from "react";
// import { UserContextApi } from "./types";
// userIn fo : {}
// updaters: () => {}

export const FixedComponentContext = createContext(undefined);

const FixedComponentProvider: React.FC = ({ children }) => {
  const [fixedComponent, setFixedComponent] = useState<JSX.Element[]>([]);

  return (
    <FixedComponentContext.Provider value={[fixedComponent, setFixedComponent]}>
      {children}
    </FixedComponentContext.Provider>
  );
};

export const useFixedComponent = () => {
  const fixedComponent = useContext(FixedComponentContext);
  if (!fixedComponent) {
    throw new Error("call inside the component tree");
  }

  return fixedComponent;
};

export default FixedComponentProvider;
