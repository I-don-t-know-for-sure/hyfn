import {
  Button,
  Card,
  Center,
  Container,
  Group,
  Image,
  Loader,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { marker } from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

import "mapbox-gl/dist/mapbox-gl.css";
import { t } from "utils/i18nextFix";
import React, { useEffect, useRef, useState } from "react";

import { calculateDuration } from "utils/calculateDuration";

import { useGetOrders } from "./hooks/useOrders";
import { CopyButton } from "hyfn-client";
import ProposalModal from "../../components/ProposalModal";
import { useUser } from "contexts/userContext/User";
import { Link } from "react-router-dom";
import { DateTimePicker } from "@mantine/dates";
import AvailableOrder from "components/AvailableOrder";
import { useLocation } from "contexts/locationContext/LocationContext";

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  ///////////////////////////////////

  const [{ coords }] = useLocation();
  const [center, setCenter] = useState(coords);
  const [reRun, setReRun] = useState(false);
  //   const [map, setMap] = useState<L.Map | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(markers[markers.length - 1]);
      // const map = mapRef.current;
      // map.on("click", (e) => {
      //   setMarkers((markers) => [...markers, [e.latlng.lat, e.latlng.lng]]);
      // });
    }
  }, [mapRef, reRun, markers]);
  //////////////////////////////////

  const {
    data: orders,
    isLoading,
    isError,
    isFetching,
    isFetched,
    fetchNextPage,
  } = useGetOrders();
  const { userDocument } = useUser();
  console.log(orders);

  return (
    <Container>
      {/* <div style={{ height: "500px", width: "500px" }}> */}

      {/* </div> */}
      <>
        {isLoading || isFetching ? (
          <Loader />
        ) : isError ? (
          <Text>{t("Error")}</Text>
        ) : (
          isFetched &&
          orders && (
            <>
              <Group
                sx={{
                  maxWidth: "100%",
                }}
              >
                <MapContainer
                  center={center as any}
                  zoom={13}
                  ref={mapRef}
                  whenReady={() => setReRun(true)}
                  style={{
                    // minHeight: "500px",
                    // minWidth: "500px",
                    height: "500px",
                    width: "100vh",
                    // maxWidth: "500px",
                    // maxHeight: "500px",
                  }}
                >
                  {/* <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /> */}
                  <TileLayer
                    attribution='Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
                    url={`https://api.mapbox.com/styles/v1/${"bariomymen"}/${"clg1t5msl00oo01pc6oagbl8y"}/tiles/256/{z}/{x}/{y}@2x?access_token=${"pk.eyJ1IjoiYmFyaW9teW1lbiIsImEiOiJjbDFrcXRnaHowM2lxM2Jtb3h3Z2J4bDQ0In0.DKfCj0bt3QfE9QgacrWnpA"}`}
                  />
                  {orders?.pages?.map((page) => {
                    console.log(page);

                    return (
                      Array.isArray(page) &&
                      page?.map((order) => {
                        const store = order?.orders[0];
                        const storeName = store.storeName;
                        const storeCoords = store?.coords?.coordinates;
                        const customerCoords = order?.buyerCoords;
                        var myIcon = L.icon({
                          iconUrl: `https://development-hyfn-org-imagesb-imagesbucket4336a197-r37cdcb6s95u.s3.eu-west-3.amazonaws.com/tablet/6d4e34c6d6b9d8958792fab46e139aa1`,
                          iconSize: [40, 40],
                          className: "circular-icon",
                          // iconSize: [38, 95],
                          // iconAnchor: [22, 94],
                          // popupAnchor: [-3, -76],
                          // // shadowUrl: 'my-icon-shadow.png',
                          // shadowSize: [68, 95],
                          // shadowAnchor: [22, 94],
                        });
                        return (
                          order !== null &&
                          order !== undefined && (
                            <Marker
                              position={[storeCoords[1], storeCoords[0]] as any}
                              icon={myIcon}
                              // icon={L.icon({
                              //   iconUrl: icon,
                              //   shadowUrl: iconShadow,
                              // })}
                            >
                              <Popup minWidth={220}>
                                <Stack>
                                  <Text weight={700}>{storeName}</Text>
                                  <Group>
                                    <Button compact>{t("Show Order")}</Button>

                                    <Button
                                      compact
                                      onClick={() => {
                                        setMarkers((markers) => [
                                          ...markers,
                                          [
                                            customerCoords[1],
                                            customerCoords[0],
                                          ],
                                        ]);
                                        // mapRef.current.setView([
                                        //   customerCoords[1],
                                        //   customerCoords[0],
                                        // ]);
                                      }}
                                    >
                                      {t("Destination")}
                                    </Button>
                                  </Group>
                                </Stack>
                                {/* <Button
                                  onClick={() => {
                                    const map = mapRef.current;
                                    if (map) {
                                      map.setView([32.13, 13.23]);
                                    }
                                    // setCenter([32.13, 13.23]);
                                  }}
                                >
                                  {"click"}
                                </Button> */}
                              </Popup>
                            </Marker>
                            // AvailabeOrder(order, userDocument)
                          )
                        );
                      })
                    );
                  })}
                  {markers.map((marker) => {
                    return (
                      <Marker
                        position={marker as any}
                        icon={L.icon({ iconUrl: icon, shadowUrl: iconShadow })}
                      >
                        <Popup>
                          {/* <Button
                            onClick={() => {
                              const map = mapRef.current;
                              if (map) {
                                map.setView([32.13, 13.23]);
                              }
                              // setCenter([32.13, 13.23]);
                            }}
                          >
                            {"click"}
                          </Button> */}
                        </Popup>
                      </Marker>
                    );
                  })}
                  {/* <Marker
          position={position as any}
          icon={L.icon({ iconUrl: icon, shadowUrl: iconShadow })}
          >
          <Popup>
          <Button
          onClick={() => {
            if (map) {
              map.setView([32.13, 13.23]);
            }
            // setCenter([32.13, 13.23]);
          }}
          >
          {"click"}
          </Button>
          </Popup>
        </Marker> */}
                </MapContainer>
              </Group>
              {orders?.pages?.map((page) => {
                console.log(page);

                return (
                  Array.isArray(page) &&
                  page?.map((order) => {
                    return (
                      order !== null &&
                      order !== undefined && (
                        <AvailableOrder
                          order={order}
                          userDocument={userDocument}
                        />
                        // AvailabeOrder(order, userDocument)
                      )
                    );
                  })
                );
              })}
            </>
          )
        )}
      </>
      {orders?.pages?.length > 0 && (
        <Center m={"12px auto"}>
          <Button
            sx={{
              width: "100%",
              maxWidth: "450px",
            }}
            onClick={() =>
              fetchNextPage({
                pageParam:
                  orders?.pages[orders?.pages?.length - 1][
                    orders?.pages[orders.pages?.length - 1]?.length - 1
                  ]?._id,
              })
            }
          >
            {t("Load more")}
          </Button>
        </Center>
      )}
    </Container>
  );
};

export default Home;
// function AvailabeOrder({order,userDocument}:{order: any, userDocument: any}): JSX.Element {
//   return <Card m={"24px auto"} key={order?._id.toString()}>
//     <Group>
//       <Text>{order?._id.toString()}</Text>

//       <CopyButton
//         value={`${order?.coords?.coordinates[0][1]},${order?.coords?.coordinates[0][0]}`} />
//       <DateTimePicker
//         value={new Date(order.deliveryDate)}
//         label={t("Delivery date")}
//         readOnly />
//       <Button
//         target="_blank"
//         rel="noopener noreferrer"
//         to={`https://www.google.com/maps/search/?api=1&query=${order?.coords?.coordinates[0][1]},${order?.coords?.coordinates[0][0]}`}
//         component={Link}
//       >
//         {t("See on map")}
//       </Button>
//       <Text>
//         {t("Number of stores")} : {order?.orders?.length}
//       </Text>
//     </Group>

//     <Group
//       mb={2}
//       m={"12px auto"}
//       position="center"
//       grow
//       sx={{
//         maxWidth: "400px",
//       }}
//     >
//       <ProposalModal
//         orderId={order._id.toString()}
//         proposal={order?.proposals?.find(
//           (proposal) => proposal.managementId ===
//             userDocument.driverManagement[0]
//         )} />
//     </Group>
//   </Card>;
// }
