// import { useEffect, useState } from "react";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup,
// } from "react-leaflet";

// export default function UserLocationMap() {
//   const [position, setPosition] = useState(null);

//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(
//       (success) => {
//         const lat = success.coords.latitude;
//         const lng = success.coords.longitude;

//         setPosition([lat, lng]);

//         console.log("Latitude:", lat);
//         console.log("Longitude:", lng);
//       },
//       (error) => {
//         console.log(error);
//         alert("Location access denied");
//       }
//     );
//   }, []);

//   if (!position) {
//     return <h2>Loading location...</h2>;
//   }

//   return (
//     <MapContainer
//       center={position}
//       zoom={15}
//       style={{ height: "500px", width: "100%" }}
//     >
//       <TileLayer
//         attribution="&copy; OpenStreetMap contributors"
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />

//       <Marker position={position}>
//         <Popup>Your Location</Popup>
//       </Marker>
//     </MapContainer>
//   );
// }