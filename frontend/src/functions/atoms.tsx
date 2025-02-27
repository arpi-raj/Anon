import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import { LocationState } from "./helper";


const { persistAtom } = recoilPersist();

export const token = atom({
  key: "token",
  default: "",
});

export const locationState = atom<LocationState>({
  key: "location",
  default: { long: 0, lat: 0 },
  effects_UNSTABLE: [persistAtom],
});
