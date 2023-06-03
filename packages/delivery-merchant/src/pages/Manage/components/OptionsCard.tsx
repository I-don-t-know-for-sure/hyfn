import {
  Card,
  CardSection,
  Checkbox,
  Container,
  Loader,
  Paper,
} from "hyfn-client";
import { randomId } from "@mantine/hooks";
import { t } from "utils/i18nextFix";
import React from "react";
import { ProductInfo, ProductsCard } from "../types";
import Options from "./Options";

interface OptionsCardProps extends ProductsCard {
  setProductInfo: any;
}

const OptionsCard: React.FC<OptionsCardProps> = ({
  onChangeHandler,
  productInfo,
  setProductInfo,
  isLoading,
}) => {
  return (
    <Paper shadow={"sm"} p={"md"}>
      {isLoading ? (
        <Container>
          <Loader />
        </Container>
      ) : (
        <
          // sx={{
          //   display: 'flex',
          //   flexDirection: 'column',
          //   padding: '18px 32px',
          //   justifyContent: 'space-between',
          // }}
        >
          <Checkbox
            label={t("This Product Has Options")}
            checked={productInfo?.hasOptions || false}
            onChange={(e) => {
              const checked = e.currentTarget.checked;
              if (checked) {
                setProductInfo((prevState: ProductInfo): ProductInfo => {
                  return {
                    ...prevState,
                    hasOptions: checked,

                    options: [
                      {
                        minimumNumberOfOptionsForUserToSelect: 0,
                        maximumNumberOfOptionsForUserToSelect: 1,
                        isRequired: false,
                        optionName: "",
                        optionValues: [
                          { value: "", key: randomId(), price: 0 },
                        ],
                        key: randomId(),
                      },
                    ],
                  };
                });
              }
              if (!checked) {
                setProductInfo((prevState: ProductInfo): ProductInfo => {
                  return {
                    ...prevState,
                    hasOptions: checked,

                    options: undefined,
                  };
                });
              }

              onChangeHandler(checked, "options", "hasOptions");
            }}
          />
        </>
      )}
      {productInfo.hasOptions && (
        <Options
          onChangeHandler={onChangeHandler}
          productInfo={productInfo}
          setProductInfo={setProductInfo}
        />
      )}
    </Paper>
  );
};

export default OptionsCard;
