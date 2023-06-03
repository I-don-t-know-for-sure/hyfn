import { Box, Button, Card, Group, TextInput } from "hyfn-client";
import { t } from "../../../util/i18nextFix";
import React, { useState } from "react";
import { convertCoordsArraytoString } from "../../../util/convertCoordsArrayToString";

interface AddressProps {
  address: any;
  setAddresses: React.Dispatch<React.SetStateAction<any[]>>;
}

const Address: React.FC<AddressProps> = ({ address, setAddresses }) => {
  const coordsType = typeof address.coords;
  const coords =
    coordsType === "string"
      ? address.coords
      : `${address.coords[1]},${address.coords[0]}`;
  const [error, setError] = useState({ error: false, message: "" });

  const convertCoordsStringToArray = (coordsString: string) => {
    const coords = coordsString.split(",");
    return [parseFloat(coords[0]), parseFloat(coords[1])];
  };
  const err = (e) => {
    alert(e);
  };
  const success = (res) => {
    setAddresses((addresses) => {
      return addresses.map((oldAddress) => {
        if (oldAddress.key === address.key) {
          return {
            ...address,
            coords: [res.coords.latitude, res.coords.longitude],
          };
        }
        return oldAddress;
      });
    });

    // ("coords", [res.coords.latitude, res.coords.longitude]);
    //alert(`lat: ${res.coords.latitude}, long: ${res.coords.longitude}`);
  };

  return (
    <Card
      sx={{
        maxWidth: "500px",
        margin: "24px auto",
      }}
    >
      <TextInput
        label={t("Label")}
        m={"6px auto"}
        value={address.label}
        onChange={(e) =>
          setAddresses((addresses) => {
            console.log(addresses);

            return addresses.map((oldAddress) => {
              if (oldAddress.key === address.key) {
                console.log(oldAddress);

                return { ...oldAddress, label: e.target.value };
              }
              return oldAddress;
            });
          })
        }
      />
      <Group mb={8}>
        <TextInput
          sx={{
            width: "65%",
          }}
          label={t("Coordinates")}
          m={"6px auto"}
          value={convertCoordsArraytoString(address.coords)}
          error={error.error}
          onBlur={(e) => {
            const coords = convertCoordsStringToArray(address.coords);
            if (coords.length !== 2) {
              setError({ error: true, message: "wrong syntax" });
            }

            setAddresses((addresses) => {
              return addresses.map((oldAddress) => {
                if (oldAddress.key === address.key) {
                  return { ...address, coords };
                }
                return oldAddress;
              });
            });
            setError({ error: false, message: "wrong syntax" });
          }}
          onChange={(e) => {
            setAddresses((addresses) => {
              return addresses.map((oldAddress) => {
                if (oldAddress.key === address.key) {
                  return { ...address, coords: e.target.value };
                }
                return oldAddress;
              });
            });
          }}
        />

        <Button
          sx={{
            width: "30%",
          }}
          mt={29}
          onClick={() => {
            navigator.geolocation.getCurrentPosition(success, err);
          }}
        >
          {t("Current Coords")}
        </Button>
      </Group>

      <TextInput
        mb={28}
        label={t("Location description")}
        value={address?.locationDescription}
        onChange={(e) => {
          setAddresses((addresses) => {
            return addresses.map((oldAddress) => {
              if (address.key === oldAddress.key) {
                return { ...oldAddress, locationDescription: e.target.value };
              }
              return oldAddress;
            });
          });
        }}
      />

      <Group position="right">
        {/* <Button
          sx={{
            width: '65%',
          }}
          onClick={() => {
            const coords = address.coords.split(',');
            setAddresses((addresses) => {
              return addresses.map((oldAddress) => {
                if (oldAddress.key === address.key) {
                  return { ...address, coords: [coords[1], coords[0]] };
                }
                return oldAddress;
              });
            });
          }}
        >
          {t('Save')}
        </Button> */}
        <Button
          sx={{
            width: "30%",
          }}
          variant="outline"
          onClick={() => {
            setAddresses((addresses) => {
              return addresses.filter((oldAddress) => {
                return oldAddress.key !== address.key;
              });
            });
          }}
        >
          {t("Delete")}
        </Button>
      </Group>
    </Card>
  );
};

export default Address;
