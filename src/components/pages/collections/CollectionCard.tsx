import { Show, createSignal } from "solid-js";
import { UserCollectionsT } from "../../../states/useCollections";
import { A } from "@solidjs/router";

const CollectionCard = ({ collection }: { collection: UserCollectionsT }) => {
  const [activeCollectionEdit, setActiveCollectionEdit] =
    createSignal<string>("");
  return (
    <div class="w-56 h-56 border border-primary/25 hover:shadow-inner card m-2 flex flex-col justify-between">
      <Show
        when={activeCollectionEdit() !== collection.id}
        fallback={
          <div class="mt-2 flex flex-col justify-between h-full">
            <div class="mx-2 h-full">
              <input
                type="text"
                value={collection.name}
                class="input input-bordered w-full"
              />
              <textarea
                class="textarea w-full textarea-bordered h-2/3 resize-none mt-1"
                value={collection.description}
              />
            </div>
            <div class="flex">
              <button
                class="grow btn btn-error no-animation card group rounded-bl-[15px] rounded-br-none rounded-t-none"
                onClick={() => setActiveCollectionEdit(collection.id)}
              >
                <svg
                  width="16"
                  height="16"
                  class="fill-primary-content"
                  viewBox="0 0 16 16"
                >
                  <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z" />
                </svg>
              </button>
              <button
                class="grow btn btn-primary no-animation card group rounded-none"
                onClick={() => setActiveCollectionEdit(collection.id)}
              >
                <svg
                  width="16"
                  height="16"
                  class="fill-primary-content"
                  viewBox="0 0 24 24"
                >
                  <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"></path>
                </svg>
              </button>
              <button
                class="btn w-fit no-animation card group rounded-br-[15px] rounded-bl-none rounded-t-none"
                onClick={() => setActiveCollectionEdit("")}
              >
                Cancel
              </button>
            </div>
          </div>
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
        <button
          class="btn btn-ghost no-animation card group rounded-bl-[15px] rounded-br-[15px] rounded-t-none"
          onClick={() => setActiveCollectionEdit(collection.id)}
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
      </Show>
    </div>
  );
};

export default CollectionCard;
