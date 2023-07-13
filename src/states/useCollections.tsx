import { createSignal } from "solid-js";

const [openedNewCollection, setOpenedNewCollection] =
  createSignal<boolean>(false);
const [loadingNewCollection, setLoadingNewCollection] =
  createSignal<boolean>(false);

export const useOpenedNewCollection = () => [
  openedNewCollection,
  setOpenedNewCollection,
];
export const useLoadingNewCollection = () => [
  loadingNewCollection,
  setLoadingNewCollection,
];
