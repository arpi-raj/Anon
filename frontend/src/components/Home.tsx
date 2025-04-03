import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  startLocationWatch,
  stopLocationWatch,
  addClient,
  verifyRoute,
} from "../functions/helper";
import { locationState, tokenState, idState } from "../functions/atoms";

const Home = () => {
  const setRecoilLocation = useSetRecoilState(locationState);
  const setToken = useSetRecoilState(tokenState);
  const setIdState = useSetRecoilState(idState);

  const token = useRecoilValue(tokenState);
  const id = useRecoilValue(idState);
  const recoilLocation = useRecoilValue(locationState);

  const [location, setLocationState] = useState(recoilLocation || { long: 0, lat: 0 });
  const [watchId, setWatchId] = useState<number | null>(null);
  const [prefRad, setPrefRad] = useState(100);
  const [username, setUsername] = useState("");
  const [lastUpdated, setLastUpdated] = useState(0);
  const [shouldSendRequest, setShouldSendRequest] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    const startWatch = async () => {
      const watch = await startLocationWatch((newLocation) => {
        const now = Date.now();
        if (now - lastUpdated >= 5000) {
          setLocationState(newLocation);
          setRecoilLocation(newLocation);
          setLastUpdated(now);
        }
      });
      setWatchId(watch.watchId);
    };

    startWatch();
    return () => {
      if (watchId !== null) stopLocationWatch(watchId);
    };
  }, [lastUpdated]);

  useEffect(() => {
    if (shouldSendRequest && location.long !== 0 && location.lat !== 0 && username.trim()) {
      const fetchData = async () => {
        if (id != null) {
          const response = await addClient(username, location, prefRad);
          setToken(response.token);
          setIdState(response.id);
          console.log("Token and ID saved:", response.token, response.id);
        } else {
          console.log("Updated location:", location);
        }
        setRecoilLocation(location);
      };
      fetchData();
      setShouldSendRequest(false);
    }
  }, [shouldSendRequest]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-4xl font-bold mb-4">Welcome to AnonChat</h1>
      <p className="mb-6 text-gray-300">Enter your preferred radius and username to start chatting</p>
      <div className="flex flex-col gap-4 w-full max-w-md">
        <input
          type="text"
          className="p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="number"
          className="p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          defaultValue={100}
          placeholder="Preferred Radius"
          onChange={(e) => setPrefRad(Number(e.target.value))}
        />
        <button
          className="p-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition text-white font-semibold"
          onClick={() => {
            if (!username.trim()) {
              alert("Please enter a username");
              return;
            }
            setShouldSendRequest(true);
            nav("/chat");
            verifyRoute(token, setIdState);
          }}
        >
          Chat
        </button>
      </div>
    </div>
  );
};

export default Home;
