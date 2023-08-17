import { Show, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { serverUrl } from "../../../lib/serverUrl";
import { classNames } from "../../../lib/classNames";
import {
  AnswersT,
  useCollectionQuestionAnswers,
} from "../../../states/useQuestionAnswers";
import LoadingSpinner from "../../LoadingSpinner";
import QuestionAnswerForms from "../../QuestionAnswerForms";

type PostQuestionAnswersT = {
  collectionId: string;
  questionName: string;
  answers: Array<AnswersT | string>;
};

const postQuestionAnswers = async (data: PostQuestionAnswersT) => {
  const response = await fetch(`${serverUrl}/question-answer`, {
    mode: "cors",
    method: "post",
    credentials: "include",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });

  return await response.json();
};

const NewQuestionAnswerForm = ({ collectionId }: { collectionId: string }) => {
  const [_, setCollectionQuestionAnswers] = useCollectionQuestionAnswers();

  const [isSaveLoading, setIsSaveLoading] = createSignal<boolean>(false);
  const [inputQuestion, setInputQuestion] = createSignal<string>("");
  const [inputAnswers, setInputAnswers] = createStore<
    Array<AnswersT | { name: string }>
  >([]);
  const [openedNewCollection, setOpenedNewCollection] =
    createSignal<boolean>(false);

  const handleCancel = () => {
    setInputAnswers([]);
    setInputQuestion("");
    setIsSaveLoading(false);
    setOpenedNewCollection(false);
  };

  const handleSave = (e: any) => {
    e.preventDefault();

    const answers = inputAnswers
      .map((answer) => answer.name)
      .filter((answer) => answer.trim().length && answer);

    if (!!inputQuestion().trim() && !!inputAnswers.length) {
      setIsSaveLoading(true);

      const data = {
        collectionId,
        questionName: inputQuestion().trim(),
        answers: answers,
      };

      postQuestionAnswers(data)
        .then((res) => {
          setCollectionQuestionAnswers(res.data);
          setInputAnswers([]);
          setInputQuestion("");
          setIsSaveLoading(false);
          setOpenedNewCollection(false);
        })
        .catch((_) => setIsSaveLoading(false));
    }
  };

  return (
    <div
      class={classNames(
        openedNewCollection()
          ? "w-80 h-full"
          : "w-48 h-48 cursor-pointer select-none",
        "card border border-primary/25 hover:shadow-md"
      )}
      onClick={() => !openedNewCollection() && setOpenedNewCollection(true)}
    >
      <Show
        when={openedNewCollection()}
        fallback={<div class="card-body text-8xl text-secondary hero">+</div>}
      >
        <div class="p-8">
          <QuestionAnswerForms
            answers={inputAnswers}
            question={inputQuestion()}
            onUpdateAnswer={setInputAnswers}
            onUpdateQuestion={(question) => setInputQuestion(question)}
            onAddAnswer={(answer) =>
              setInputAnswers([...inputAnswers, { name: answer }])
            }
            onDeleteAnswer={(deletedIndex) => {
              const updatedAnswers = inputAnswers.filter((answer, index) => {
                if (index !== deletedIndex) return answer;
              });
              setInputAnswers(updatedAnswers);
            }}
          />
          <div class="flex mt-8">
            <button
              title="Cancel"
              class="grow btn w-fit no-animation card group rounded-md rounded-r-none"
              onClick={() => handleCancel()}
            >
              Cancel
            </button>

            <button
              disabled={!inputQuestion().length || !inputAnswers.length}
              title="Save"
              class="grow btn btn-primary no-animation card group rounded-md rounded-l-none"
              onClick={(e) => handleSave(e)}
            >
              <Show when={isSaveLoading()} fallback="Save">
                <LoadingSpinner size="default" />
              </Show>
            </button>
          </div>
        </div>
      </Show>
    </div>
  );
};

export default NewQuestionAnswerForm;
