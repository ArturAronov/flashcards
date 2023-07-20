import { Show, createSignal } from "solid-js";
import {
  useLoadingNewCollection,
  useUserCollections,
} from "../../../states/useCollections";
import { serverUrl } from "../../../lib/serverUrl";

type NewGroupT = {
  name: string;
  description: string;
};

const initialInput = {
  name: "",
  description: "",
};

const postNewCollection = async (data: NewGroupT) => {
  const response = await fetch(serverUrl + "/collections", {
    mode: "cors",
    method: "post",
    credentials: "include",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });

  return await response.json();
};

const NewCollection = () => {
  const [newCollectionInput, setNewCollectionInput] =
    createSignal<NewGroupT>(initialInput);
  const [loadingNewCollection, setLoadingNewCollection] =
    useLoadingNewCollection();
  const [openedNewCollection, setOpenedNewCollection] =
    createSignal<boolean>(false);

  const [setUserCollections] = useUserCollections();

  const handleCollectionSubmit = (e: any) => {
    e.preventDefault();

    if (newCollectionInput().name) {
      setLoadingNewCollection(true);
      postNewCollection(newCollectionInput()).then((res) => {
        setOpenedNewCollection(false);
        setUserCollections((collections) => [...collections, res.data[0]]);
      });
    }
    setLoadingNewCollection(false);
  };
  return (
    <Show
      when={openedNewCollection()}
      fallback={<div class="card-body text-8xl text-secondary hero">+</div>}
    >
      <div class="hero h-full">
        <div class="hero-content">
          <div>
            <label class="label -mb-1.5">
              <span class="label-text">Group Name</span>
            </label>
            <input
              type="text"
              autocomplete="off"
              class="input input-bordered w-full"
              onInput={(e) =>
                setNewCollectionInput({
                  ...newCollectionInput(),
                  name: e.currentTarget.value,
                })
              }
            />
            <label class="label -mb-1.5">
              <span class="label-text">Description</span>
            </label>
            <input
              type="text"
              autocomplete="off"
              class="input input-bordered w-full"
              onInput={(e) =>
                setNewCollectionInput({
                  ...newCollectionInput(),
                  description: e.currentTarget.value,
                })
              }
            />
            <div class="mt-3 flex justify-between">
              <button
                class="btn btn-warning btn-sm btn-outline w-24"
                onClick={() => setOpenedNewCollection(false)}
              >
                Cancel
              </button>
              <Show
                when={loadingNewCollection(true)}
                fallback={
                  <button
                    class="btn btn-ghost btn-sm w-24"
                    disabled={!newCollectionInput().name.length}
                    onClick={(e) => handleCollectionSubmit(e)}
                  >
                    Save
                  </button>
                }
              >
                <button class="btn btn-ghost btn-sm w-24" disabled>
                  <span class="loading loading-spinner"></span>
                </button>
              </Show>
            </div>
          </div>
        </div>
      </div>
    </Show>
  );
};

export default NewCollection;
