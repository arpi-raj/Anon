import { useEffect, useState } from "react";
import { startLocationWatch, stopLocationWatch } from "../functions/helper";

export default function Home() {
  const [location, setLocation] = useState({ long: 0, lat: 0 });
  
  useEffect(() => {
    const watchData = startLocationWatch(setLocation);
    return () => {
      stopLocationWatch(watchData.watchId);
    };
  }, [location.lat,location.long]); // Empty dependency array means this runs once on mount
  
  return (
    <div>
      <h1>Home</h1>
      <p>Longitude: {location.long}</p>
      <p>Latitude: {location.lat}</p>
    </div>
  );
}
