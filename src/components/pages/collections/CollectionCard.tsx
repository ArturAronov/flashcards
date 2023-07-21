import { Show, createSignal } from "solid-js";
import { UserCollectionsT } from "../../../states/useCollections";
import { A } from "@solidjs/router";
import EditCollection from "./EditCollection";

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
        <div>
          <p class="text-xs text-error font-bold">{error()}</p>
          <button
            class="btn w-full btn-ghost no-animation card group rounded-bl-[15px] rounded-br-[15px] rounded-t-none"
            onClick={() => {
              setError("");
              setActiveCollectionEdit(collection.id);
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              class="fill-neutral-focus group-hover:fill-primary-focus"
            >
              <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" />
            </svg>
          </button>
        </div>
      </Show>
    </div>
  );
};

export default CollectionCard;
