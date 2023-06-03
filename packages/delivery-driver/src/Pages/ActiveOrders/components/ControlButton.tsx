import { Box, Button, ThemeIcon } from "hyfn-client";
import PickupModal from "components/PickupModal";
import { t } from "utils/i18nextFix";
import React, { useState } from "react";

interface ControlButtonProps {
  productQTY: any;
  pickUp: (count: any) => void;
  notFound: () => void;
  found?: any;
}

const ControlButton: React.FC<ControlButtonProps> = ({
  productQTY,
  pickUp,
  notFound,
  found,
}) => {
  const [edit, setEdit] = useState(false);
  const modifiedPickUp = (count: any) => {
    pickUp(count);
    setEdit(false);
  };
  const modifiedNotFound = () => {
    notFound();
    setEdit(false);
  };
  return (
    <>
      {edit ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          {/* <Box
            sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
            mt={6}
        > */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <PickupModal
              qty={productQTY}
              pickup={modifiedPickUp}
              notFound={modifiedNotFound}
              found={found}
            />
            <Button
              onClick={() => {
                setEdit(false);
              }}
              size="xs"
              sx={{
                maxWidth: 100,
              }}
            >
              {t("Cancel")}
            </Button>
            {/* </Box> */}
          </Box>
        </Box>
      ) : (
        <Button onClick={() => setEdit(true)}>edit</Button>
      )}
    </>
  );
};

export default ControlButton;
