import { Show, createSignal } from "solid-js";
import {
  UserCollectionsT,
  useUserCollections,
} from "../../../states/useCollections";
import { serverUrl } from "../../../lib/serverUrl";
import { useUserId } from "../../../states/useUser";
import { NewGroupT } from "./NewCollection";
import LoadingSpinner from "../../LoadingSpinner";
import DeleteIcon from "../../Icons/DeleteIcon";
import SaveIcon from "../../Icons/SaveIcon";

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
                <LoadingSpinner size="default" />
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
              <DeleteIcon />
            </button>
            <button
              title="Save"
              class="grow btn btn-primary no-animation card group rounded-none"
              onClick={() => handleCollectionSave()}
            >
              <Show
                when={isBtnLoading()}
                fallback={
                  <SaveIcon />
                }
              >
                <LoadingSpinner size="default" />
              </Show>
            </button>
          </>
        </Show>

        <button
          class="btn w-fit no-animation card group rounded-br-[15px] rounded-bl-none rounded-t-none"
          onClick={() => setActiveCollectionEdit("")}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditCollection;
