import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import { LocationState } from "./helper";


const { persistAtom } = recoilPersist();

export const tokenState = atom({
  key: "token",
  default: "",
  effects_UNSTABLE: [persistAtom],
});

export const idState = atom({
  key: "id",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const locationState = atom<LocationState>({
  key: "location",
  default: { long: 0, lat: 0 },
  effects_UNSTABLE: [persistAtom],
});
