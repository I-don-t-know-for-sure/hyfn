import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { marker } from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { useEffect, useRef, useState } from "react";

import { Button } from "@mantine/core";
import "mapbox-gl/dist/mapbox-gl.css";

// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png").default,
//   iconUrl: require("leaflet/dist/images/marker-icon.png").default,
//   shadowUrl: require("leaflet/dist/images/marker-shadow.png").default,
// });

const Map = () => {
  const [position, setPosition] = useState([51.505, -0.09]);
  const [center, setCenter] = useState([51.505, -0.09]);
  const [reRun, setReRun] = useState(false);
  //   const [map, setMap] = useState<L.Map | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current;
      map.on("click", (e) => {
        setMarkers((markers) => [...markers, [e.latlng.lat, e.latlng.lng]]);
      });
    }
  }, [mapRef, reRun]);

  return (
    <div style={{ height: "500px", width: "500px" }}>
      <MapContainer
        center={center as any}
        zoom={13}
        ref={mapRef}
        whenReady={() => setReRun(true)}
        style={{ height: "500px", width: "500px" }}
      >
        {/* <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /> */}
        <TileLayer
          attribution='Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
          url={`https://api.mapbox.com/styles/v1/${"bariomymen"}/${"clg1t5msl00oo01pc6oagbl8y"}/tiles/256/{z}/{x}/{y}@2x?access_token=${"pk.eyJ1IjoiYmFyaW9teW1lbiIsImEiOiJjbDFrcXRnaHowM2lxM2Jtb3h3Z2J4bDQ0In0.DKfCj0bt3QfE9QgacrWnpA"}`}
        />
        {markers.map((marker) => {
          return (
            <Marker
              position={marker as any}
              icon={L.icon({ iconUrl: icon, shadowUrl: iconShadow })}
            >
              <Popup>
                <Button
                  onClick={() => {
                    const map = mapRef.current;
                    if (map) {
                      map.setView([32.13, 13.23]);
                    }
                    // setCenter([32.13, 13.23]);
                  }}
                >
                  {"click"}
                </Button>
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
    </div>
  );
};

export default Map;

// function Map() {
//     function ChangeMapView() {
//       const map = useMap();
//       map.
//       map.setView([40.7128, -74.006], 13);
//       return null;
//     }

//     return (
//       <div>
//         <button onClick={ChangeMapView}>Change Center</button>
//         <MapContainer center={[51.505, -0.09]} zoom={13}>
//           <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//           <Marker position={[51.505, -0.09]}>
//             <Popup>
//               A pretty CSS3 popup. <br /> Easily customizable.
//             </Popup>
//           </Marker>
//           <ChangeMapView />
//         </MapContainer>
//       </div>
//     );
//   }

//   export default Map
