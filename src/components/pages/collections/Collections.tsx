import { onMount } from "solid-js";
import { serverUrl } from "../../../lib/serverUrl";
import { useUserCollections } from "../../../states/useCollections";
import CollectionCard from "./CollectionCard";
import NewCollection from "./NewCollection";

const getUserCollections = async () => {
  const response = await fetch(serverUrl + "/collections", {
    mode: "cors",
    method: "get",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  return await response.json();
};

export const Collections = () => {
  const [userCollections, setUserCollections] = useUserCollections();

  onMount(() => {
    if (!userCollections([]).length) {
      console.log("Fetching user's collections");
      getUserCollections().then((res) => setUserCollections(res.data));
    }
  });

  return (
    <main class="my-10 hero min-h-full ">
      <section class="hero-content text-center">
        <div>
          <div>
            <h1 class="text-5xl font-bold mb-8 text-primary">Collections</h1>
          </div>

          <div class="flex flex-wrap justify-center">
            {userCollections([]).map((collection) => (
              <CollectionCard collection={collection} />
            ))}
          </div>
          <div class="w-full flex justify-center mt-8">
            <NewCollection />
          </div>
        </div>
      </section>
    </main>
  );
};
