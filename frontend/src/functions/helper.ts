import axios from "axios";
import { SetterOrUpdater } from "recoil";

const url = import.meta.env.VITE_API_URL as string;

export interface LocationState {
  long: number;
  lat: number;
}

interface LocationWatch {
  watchId: number;
  location: LocationState;
}

export const startLocationWatch = (
  callback: (location: LocationState) => void
): LocationWatch => {
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

export async function addClient(
  userName: string,
  coords: LocationState,
  prefRad: number
): Promise<{ id: number; token: string; message: string }> {
  try {
    const response = await axios.post(`${url}/addClient`, {
      userName,
      coords,
      prefRad,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
}

export const getChatableClients = async (
  token: string,
  id: number
): Promise<{ id: number; userName: string }[]> => {
  try {
    const response = await axios.get(`${url}/chatable?id=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error getting chatable clients:", error);
    throw error;
  }
};

export const verifyRoute = async (
  token: string,
  setIdState: SetterOrUpdater<number>
) => {
  try {
    const response = await axios.post(
      `${url}/verifyClient`,
      {}, // Empty body since no data is sent
      {
        headers: {
          Authorization: `Bearer ${token}`, // Ensure "Authorization" is capitalized
        },
      }
    );
    console.log(response.data);
    setIdState(response.data.id);
    return response;
  } catch (error) {
    console.error("Error verifying route:", error);
    throw error;
  }
};

export const stopLocationWatch = (watchId: number) => {
  navigator.geolocation.clearWatch(watchId);
};
