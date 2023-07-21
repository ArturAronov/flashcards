import { Show, createSignal } from "solid-js";
import {
  UserCollectionsT,
  useUserCollections,
} from "../../../states/useCollections";
import { serverUrl } from "../../../lib/serverUrl";
import { useUserId } from "../../../states/useUser";
import { NewGroupT } from "./NewCollection";

type PropsT = {
  collection: UserCollectionsT;
  setError: (input: string) => void;
  setActiveCollectionEdit: (input: string) => void;
};

const deleteCollection = async (collectionId: string) => {
  const response = await fetch(`${serverUrl}/collections/${collectionId}`, {
    mode: "cors",
    method: "delete",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  return await response.json();
};

const updateCollection = async (data: NewGroupT & { collectionId: string }) => {
  const response = await fetch(`${serverUrl}/collections`, {
    mode: "cors",
    method: "put",
    credentials: "include",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });

  return await response.json();
};

const EditCollection = ({
  collection,
  setError,
  setActiveCollectionEdit,
}: PropsT) => {
  const [userId, _] = useUserId();
  const [userCollections, setUserCollections] = useUserCollections();
  const [isDeleteActive, setIsDeleteActive] = createSignal<boolean>(false);
  const [isBtnLoading, setIsBtnLoading] = createSignal<boolean>(false);
  const [editInput, setEditInput] = createSignal({
    name: collection.name,
    description: collection.description,
  });

  const handleCollectionDelete = (collectionId: string) => {
    if (collectionId && isDeleteActive() && userId("")) {
      setIsBtnLoading(true);
      deleteCollection(collectionId)
        .then((_) => {
          const updatedCollections = userCollections([]).filter(
            (element) => element.id !== collection.id
          );
          setIsDeleteActive(false);
          setActiveCollectionEdit("");
          setUserCollections(updatedCollections);
          setIsBtnLoading(false);
        })
        .catch((_) => {
          setIsDeleteActive(false);
          setActiveCollectionEdit("");
          setError("Something went wrong, please try again later...");
          setIsBtnLoading(false);
        });
    }
  };

  const handleCollectionSave = () => {
    updateCollection({ ...editInput(), collectionId: collection.id })
      .then((_) => {
        const updatedCollections = userCollections([]).map((element) => {
          if (element.id === collection.id) {
            return {
              ...element,
              name: editInput().name,
              description: editInput().description,
            };
          } else return element;
        });

        setIsDeleteActive(false);
        setActiveCollectionEdit("");
        setUserCollections(updatedCollections);
        setIsBtnLoading(false);
      })
      .catch((_) => {
        setIsDeleteActive(false);
        setActiveCollectionEdit("");
        setError("Something went wrong, please try again later...");
        setIsBtnLoading(false);
      });
    setActiveCollectionEdit("");
  };

  return (
    <div class="mt-2 flex flex-col justify-between h-full">
      <div class="mx-2 h-full">
        <input
          type="text"
          value={editInput().name}
          class="input input-bordered w-full focus:border-neutral/50 !outline-none"
          onChange={(e) =>
            setEditInput({ ...editInput(), name: e.currentTarget.value })
          }
        />
        <textarea
          value={editInput().description}
          class="textarea w-full textarea-bordered h-2/3 resize-none mt-1 focus:border-neutral/50 !outline-none"
          onChange={(e) =>
            setEditInput({ ...editInput(), description: e.currentTarget.value })
          }
        />
      </div>
      <div class="flex">
        <Show
          when={!isDeleteActive()}
          fallback={
            <button
              title="Confirm Delete"
              class="grow btn btn-error no-animation card group rounded-bl-[15px] rounded-br-none rounded-t-none"
              onClick={() => handleCollectionDelete(collection.id)}
            >
              <Show when={isBtnLoading()} fallback="Confirm">
                <span class="loading loading-spinner"></span>
              </Show>
            </button>
          }
        >
          <>
            <button
              title="Delete"
              class="grow btn btn-error no-animation card group rounded-bl-[15px] rounded-br-none rounded-t-none"
              onClick={() => setIsDeleteActive(true)}
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
              title="Save"
              class="grow btn btn-primary no-animation card group rounded-none"
              onClick={() => handleCollectionSave()}
            >
              <Show
                when={isBtnLoading()}
                fallback={
                  <svg
                    width="16"
                    height="16"
                    class="fill-primary-content"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"></path>
                  </svg>
                }
              >
                <span class="loading loading-spinner"></span>
              </Show>
            </button>
          </>
        </Show>

        <button
          class="btn w-fit no-animation card group rounded-br-[15px] rounded-bl-none rounded-t-none"
          onClick={() => setActiveCollectionEdit('')}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditCollection;
