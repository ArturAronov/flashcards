import { Show, onMount } from "solid-js";
import { useParams } from "@solidjs/router";
import { shuffle } from "../../../lib/shuffle";
import { getCollection } from "../../../lib/getCollection";
import { useOpenCollection } from "../../../states/useCollection";
import { useCollectionQuestionAnswers } from "../../../states/useQuestionAnswers";
import LoadingSpinner from "../../LoadingSpinner";
import PlayCard from "./PlayCard";

const Play = () => {
  const params = useParams();
  const { collectionId } = params;

  const [openCollection, setOpenCollection] = useOpenCollection();
  const [collectionQuestionAnswers, setCollectionQuestionAnswers] =
    useCollectionQuestionAnswers();

  onMount(() => {
    if (!openCollection()?.id || openCollection()?.id !== collectionId) {
      getCollection(collectionId).then((res) => {
        const { collection, questionAnswers } = res.data;
        const shuffledQuestionAnswers = shuffle(questionAnswers).filter(
          (e) => e.answers[0]
        );
        // @ts-ignore
        setOpenCollection(collection[0]);
        setCollectionQuestionAnswers(shuffledQuestionAnswers);
      });
    }
  });
  return (
    <Show
      when={collectionQuestionAnswers([]).length}
      fallback={
        <div class="hero pt-8">
          <LoadingSpinner size="large" />
        </div>
      }
    >
      <PlayCard collectionQuestionAnswers={collectionQuestionAnswers([])} />
    </Show>
  );
};

export default Play;
