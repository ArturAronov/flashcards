import { createSignal } from "solid-js";

const [userId, setUserId] = createSignal<string>("");
const [loadingUserId, setLoadingUserId] = createSignal<boolean>(false);

export const useUserId = () => [userId, setUserId];
export const useLoadingUserId = () => [loadingUserId, setLoadingUserId];
