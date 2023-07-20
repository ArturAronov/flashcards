import { createSignal, onMount } from "solid-js";
import { serverUrl } from "../../../lib/serverUrl";
import { classNames } from "../../../lib/classNames";
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
  const [openedNewCollection, setOpenedNewCollection] =
    createSignal<boolean>(false);

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
            <div
              class={classNames(
                openedNewCollection()
                  ? "w-96 h-96"
                  : "w-48 h-48 cursor-pointer hover:shadow-md active:shadow-inner select-none",
                "card shadow-xl flex justify-center"
              )}
              onClick={() =>
                !openedNewCollection() && setOpenedNewCollection(true)
              }
            >
              <NewCollection />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
