import { Show, createSignal } from "solid-js";
import { classNames } from "../../lib/classNames";

export const Collections = () => {
  const [openedNewCollection, setOpenedNewCollection] = createSignal(false);
  const [newGroupName, setNewGroupName] = createSignal("");

  return (
    <main class="my-10 hero min-h-full">
      <section class="hero-content text-center">
        <div>
          <div>
            <h1>Collections</h1>
          </div>
          <div
            class={classNames(
              openedNewCollection()
                ? "w-96"
                : "w-48 cursor-pointer hover:shadow-md active:shadow-inner select-none",
              "card shadow-xl h-48"
            )}
            onClick={() =>
              !openedNewCollection() && setOpenedNewCollection(true)
            }
          >
            <Show
              when={openedNewCollection()}
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
                      onInput={(e) => setNewGroupName(e.currentTarget.value)}
                    />
                    <div class="mt-3 flex justify-between">
                      <button
                        class="btn btn-warning btn-sm btn-outline w-24"
                        onClick={() => setOpenedNewCollection(false)}
                      >
                        Cancel
                      </button>
                      <button
                        class="btn btn-ghost btn-sm w-24"
                        disabled={!newGroupName().length}
                        // onClick={() => setOpenedNewCollection(false)}
                      >
                        Save
                      </button>
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
