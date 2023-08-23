import { serverUrl } from "./serverUrl";

export const getCollection = async (collectionId: string) => {
  const response = await fetch(`${serverUrl}/collections/${collectionId}`, {
    mode: "cors",
    method: "get",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  return await response.json();
};
