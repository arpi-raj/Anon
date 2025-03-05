import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import {
  startLocationWatch,
  stopLocationWatch,
  addClient,
} from "../functions/helper";
import { locationState } from "../functions/atoms"; // Recoil atom for location

const Home = () => {
  const setRecoilLocation = useSetRecoilState(locationState);
  const [location, setLocationState] = useState({ long: 0, lat: 0 });
  const [watchId, setWatchId] = useState<number | null>(null);
  const [prefRad, setPrefRad] = useState(0);
  const isFirstUpdate = useRef(true);
  const nav = useNavigate();

  useEffect(() => {
    const startWatch = async () => {
      // Start watching location
      const watch = await startLocationWatch((newLocation) => {
        setLocationState(newLocation); // Update local state
        setRecoilLocation(newLocation); // Update Recoil state
      });

      setWatchId(watch.watchId); // Store watch ID for cleanup
    };

    startWatch();

    return () => {
      if (watchId !== null) {
        stopLocationWatch(watchId);
      }
    };
  }, []); // Runs only on mount

  useEffect(() => {
    if (location.long !== 0 && location.lat !== 0) {
      const fetchData = async () => {
        if (isFirstUpdate.current) {
          await addClient("test", location, prefRad);
          isFirstUpdate.current = false; // No re-render
        } else {
          // await updateClient("test", location);
          console.log("Updated location: "+ "lat:" + location.lat+ ", long: " + location.long);
        }
      };
      fetchData();
      setRecoilLocation(location);
    }
  }, [location, prefRad]);

  return (
    <div>
      <h1>Welcome to AnonChat</h1>
      <p>To get starded just enter your preffered radius and click chat</p>
      <div>
        <input
          placeholder="Preffered Radius"
          onClick={(e) => {
            const target = e.target as HTMLInputElement;
            setPrefRad(Number(target.value));
          }}
        ></input>
        <button onClick={() => nav("/chat")}>chat</button>
      </div>
    </div>
  );
};

export default Home;
