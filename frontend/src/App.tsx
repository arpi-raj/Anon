import "./App.css";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import url from "./assets/config";
import "./components/List";
import List from "./components/List";

interface LocationState {
  latitude: number;
  longitude: number;
}

function App() {
  const [location, setLocation] = useState<LocationState>({
    latitude: 0,
    longitude: 0,
  });
  const [watchId, setWatchId] = useState<number | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  const handleLocationError = (error: GeolocationPositionError) => {
    console.error("Error getting location:", error.message);
  };

  const sendLocation = useCallback(async () => {
    try {
      await axios.post(`/api/location`, {
        latitude: location.latitude,
        longitude: location.longitude,
        prefRadius: 10,
      });
    } catch (error) {
      console.error("Error sending location:", error);
    }
  }, [location]);

  const startLocationTracking = async () => {
    if ("geolocation" in navigator) {
      try {
        const watch = await new Promise((resolve, reject) => {
          const id = navigator.geolocation.watchPosition(
            (position) => {
              
              const { latitude, longitude } = position.coords;
              setLocation({ latitude, longitude });
              console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
            },
            (error) => {
              handleLocationError(error);
              reject(error);
            },
            {
              enableHighAccuracy: true,
              maximumAge: 5000,
              timeout: 10000,
            }
          );
          resolve(id);
        });

        setWatchId(watch as number);
        console.log(watchId)
        setIsTracking(true);
      } catch (error) {
        console.error("Error starting location tracking:", error);
      }
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const stopLocationTracking = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setIsTracking(false);
    }
  };

  const handleShareLocation = async () => {
    if (!isTracking) {
      await startLocationTracking();
    } else {
      stopLocationTracking();
    }
  };

  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  useEffect(() => {
    if (isTracking && location.latitude !== 0 && location.longitude !== 0) {
      sendLocation();
    }
  }, [location, isTracking, sendLocation]);

  return (
    <>
      <List />
      <h1>Location Tracker</h1>
      <button onClick={handleShareLocation}>
        {isTracking ? "Stop Sharing Location" : "Share Location"}
      </button>
      {isTracking && (
        <div>
          <p>Current Location:</p>
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
        </div>
      )}
    </>
  );
}

export default App;
