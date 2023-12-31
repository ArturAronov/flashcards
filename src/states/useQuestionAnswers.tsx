import { createSignal } from "solid-js";

export type AnswersT = {
  id: string;
  name: string;
  wrong: number;
  correct: number;
  skipped: number;
};

export type CollectionQuestionAnswersT = {
  questionId: string;
  collectionId: string;
  name: string;
  date_created: string;
  answers: Array<AnswersT>;
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
