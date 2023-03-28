import { Badge, Button, Card, Container, Group, Text } from "@mantine/core";

import { t } from "utils/i18nextFix";
import { Helmet } from "react-helmet-async";

const Home: React.FC = () => {
  // any logic inside an if statement shoud be put in a function
  // instead of if else statments use guard clauses and return for more readablity
  // check for null and undefind after mongo queries and find function
  // after an update check if the operation actually updated a document
  // create yup schemas for mongo documents and validate everything before performing any operation even on parts of documents
  // use throw key word to throw custom errors
  // make sure that everything is predictable
  // put finctions in seperate files for better code read
  // after map and filter maybe check if the array is diffrent to make sure that the code is always working right

  return (
    <Container>
      {/* <Helmet>
        <title>{t("Home")}</title>
      </Helmet> */}
    </Container>
  );
};

export default Home;
