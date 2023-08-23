import { Show, createSignal } from "solid-js";
import { UserCollectionsT } from "../../../states/useCollections";
import { A } from "@solidjs/router";
import EditCollection from "./EditCollection";
import SettingsIcon from "../../icons/SettingsIcon";

const CollectionCard = ({ collection }: { collection: UserCollectionsT }) => {
  const [activeCollectionEdit, setActiveCollectionEdit] =
    createSignal<string>("");
  const [error, setError] = createSignal<string>("");
  return (
    <div class="w-56 h-56 border border-primary/25 hover:shadow-lg card m-2 flex flex-col justify-between">
      <Show
        when={activeCollectionEdit() !== collection.id}
        fallback={
          <EditCollection
            collection={collection}
            setError={setError}
            setActiveCollectionEdit={setActiveCollectionEdit}
          />
        }
      >
        <A href={`/collection/${collection.id}`} class="grow">
          <div class="mt-2 mx-2">
            <p class="flex items-center justify-center h-full text-base-content font-bold text-xl">
              {collection.name}
            </p>
            <p>{collection.description}</p>
          </div>
        </A>
        <div class="flex w-full border-t border-primary/25">
          <p class="text-xs text-error font-bold">{error()}</p>
          <button
            title="Play"
            class="btn flex-grow btn-ghost no-animation card group rounded-t-none rounded-r-none"
            onClick={() => {
              setError("");
              setActiveCollectionEdit(collection.id);
            }}
          >
            <SettingsIcon />
          </button>
          <A
            href={`/play/${collection.id}`}
            class="border-l border-primary/25 flex-grow card group  rounded-br-[15px] rounded-t-none rounded-l-none"
          >
            <button class="btn btn-ghost no-animation  rounded-br-[15px] rounded-t-none rounded-l-none">
              Play
            </button>
          </A>
        </div>
      </Show>
    </div>
  );
};

export default CollectionCard;
