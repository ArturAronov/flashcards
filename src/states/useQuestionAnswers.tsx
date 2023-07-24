import { createSignal } from "solid-js";

export type CollectionQuestionAnswersT = {
  questionId: string;
  answerId: string;
  name: string;
  date_created: string;
  answers: Array<string>;
};

const [collectionQuestionAnswers, setCollectionQuestionAnswers] = createSignal<
  Array<CollectionQuestionAnswersT>
>([]);

const [loadingNewCollection, setLoadingNewCollection] =
  createSignal<boolean>(false);

export const useCollectionQuestionAnswers = () => [
  collectionQuestionAnswers,
  setCollectionQuestionAnswers,
];

export const useLoadingNewCollection = () => [
  loadingNewCollection,
  setLoadingNewCollection,
];
