import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import url from "./assets/config";

function App() {
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  const [watchId, setWatchId] = useState<number | null>(null);

  // Define fetchLocation inside the component to have access to setLocation
  const fetchLocation = async (): Promise<void> => {
    console.log("Button clicked");
    if ("geolocation" in navigator) {
      const watch = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
        },
        (error) => {
          console.error("Error getting location:", error.message);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 5000, // refreshes after every 5s even if location is changed
          timeout: 10000, // Set a timeout to handle slow responses
        }
      setWatchId(watch);
    } else {
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  useEffect(() => {
    const sendLocation = async (): Promise<void> => {
      try {
        await axios.post(`${url}/location`, {
          latitude: location.latitude,
          longitude: location.longitude,
        });
      } catch (error) {
        console.error("Error sending location:", error);
      }
    };

    if (location.latitude !== 0 && location.longitude !== 0) {
      sendLocation(); // Send location every time it updates
    }

    return () => {
      navigator.geolocation.clearWatch(watch);
      console.log("Component unmounted");
    };
  }, [location]);

  return (
    <>
      <div>
        <button onClick={fetchLocation}>Share Location</button>
      </div>
    </>
  );
}

export default App;
