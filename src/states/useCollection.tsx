import { createSignal } from "solid-js";

export type UserCollectionT = {
  id: string;
  name: string;
  description: string;
  date_created: string;
};

const [openCollection, setOpenCollection] = createSignal<UserCollectionT | undefined>();

const [loadingOpenCollection, setLoadingOpenCollection] =
  createSignal<boolean>(true);

export const useOpenCollection = () => [openCollection, setOpenCollection];

export const useLoadingOpenCollection = () => [
  loadingOpenCollection,
  setLoadingOpenCollection,
];
