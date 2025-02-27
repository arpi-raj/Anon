interface LocationState {
  long: number;
  lat: number;
}

interface LocationWatch {
  watchId: number;
  location: LocationState;
}

export const startLocationWatch = (callback: (location: LocationState) => void): LocationWatch => {
  let location: LocationState = { long: 0, lat: 0 };

  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      location = {
        long: position.coords.longitude,
        lat: position.coords.latitude,
      };
      callback(location);
    },
    (error) => {
      console.error("Error getting location:", error.message);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 5000,
      timeout: 10000,
    }
  );

  return { watchId, location };
};

export const stopLocationWatch = (watchId: number) => {
  navigator.geolocation.clearWatch(watchId);
};