import { createSignal } from "solid-js";

export type UserCollectionsT = {
  id: string;
  name: string;
  description: string;
  date_created: string;
};

const [userCollections, setUserCollections] = createSignal<
  Array<UserCollectionsT>
>([]);

const [loadingNewCollection, setLoadingNewCollection] =
  createSignal<boolean>(false);

export const useUserCollections = () => [userCollections, setUserCollections];

export const useLoadingNewCollection = () => [
  loadingNewCollection,
  setLoadingNewCollection,
];
