import { Show, createSignal, onMount } from "solid-js";
import { useParams } from "@solidjs/router";
import { serverUrl } from "../../../lib/serverUrl";
import { useCollectionQuestionAnswers } from "../../../states/useQuestionAnswers";
import {
  useLoadingOpenCollection,
  useOpenCollection,
} from "../../../states/useCollection";
import NewQuestionAnswerForm from "./NewQuestionAnswerForm";
import QuestionAnswerList from "./QuestionAnswerList";
import LoadingSpinner from "../../LoadingSpinner";

const getCollection = async (collectionId: string) => {
  const response = await fetch(`${serverUrl}/collections/${collectionId}`, {
    mode: "cors",
    method: "get",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  return await response.json();
};

const Collection = () => {
  const params = useParams();
  const { collectionId } = params;

  const [openCollection, setOpenCollection] = useOpenCollection();
  const [loadingOpenCollection, setLoadingOpenCollection] =
    useLoadingOpenCollection();
  const [_, setCollectionQuestionAnswers] = useCollectionQuestionAnswers();

  onMount(() => {
    if (!openCollection()?.id || openCollection()?.id !== collectionId) {
      getCollection(collectionId).then((res) => {
        const { collection, questionAnswers } = res.data;
        // @ts-ignore
        setOpenCollection(collection[0]);
        setLoadingOpenCollection(false);
        setCollectionQuestionAnswers(questionAnswers);
      });
    }
  });

  return (
    <section>
      <Show
        when={
          loadingOpenCollection(true) || openCollection()?.id !== collectionId
        }
        fallback={
          <div class="hero-content flex flex-col">
            <h1 class="text-5xl font-bold mb-8 text-center">
              {openCollection()?.name}
            </h1>
            <NewQuestionAnswerForm collectionId={collectionId} />
          </div>
        }
      >
        <div class="hero">
          <LoadingSpinner size="large" />
        </div>
      </Show>
      <QuestionAnswerList />
    </section>
  );
};

export default Collection;
