import { Show, createSignal } from "solid-js";
import { classNames } from "../../lib/classNames";
import { serverUrl } from "../../lib/serverUrl";
import {
  useLoadingNewCollection,
  useOpenedNewCollection,
} from "../../states/useCollections";

type NewGroupT = {
  name: string;
  description: string;
};

const initialInput = {
  name: "",
  description: "",
};

const postUserSignUp = async (data: NewGroupT) => {
  const [_, setLoadingNewCollection] = useLoadingNewCollection();
  const [loadingNewCollection, setOpenedNewCollection] =
    useOpenedNewCollection();

  setLoadingNewCollection(true);
  const response = await fetch(serverUrl + "/collections", {
    mode: "cors",
    method: "post",
    credentials: "include",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
  setLoadingNewCollection(false);

  if (response.status === 200) setOpenedNewCollection(false);
  return await response.json();
};

export const Collections = () => {
  const [openedNewCollection, setOpenedNewCollection] =
    useOpenedNewCollection();
  const [loadingNewCollection, _] = useLoadingNewCollection();
  const [newGroupInput, setNewGroupInput] =
    createSignal<NewGroupT>(initialInput);

  return (
    <main class="my-10 hero min-h-full">
      <section class="hero-content text-center">
        <div>
          <div>
            <h1>Collections</h1>
          </div>
          <div
            class={classNames(
              openedNewCollection(true)
                ? "w-96 h-96"
                : "w-48 h-48 cursor-pointer hover:shadow-md active:shadow-inner select-none",
              "card shadow-xl"
            )}
            onClick={() =>
              !openedNewCollection(false) && setOpenedNewCollection(true)
            }
          >
            <Show
              when={openedNewCollection(true)}
              fallback={
                <div class="card-body text-8xl text-secondary hero">+</div>
              }
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
                        setNewGroupInput({
                          ...newGroupInput(),
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
                        setNewGroupInput({
                          ...newGroupInput(),
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
                        when={loadingNewCollection(false)}
                        fallback={
                          <button
                            class="btn btn-ghost btn-sm w-24"
                            disabled={!newGroupInput().name.length}
                            onClick={() => postUserSignUp(newGroupInput())}
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
          </div>
        </div>
      </section>
    </main>
  );
};
