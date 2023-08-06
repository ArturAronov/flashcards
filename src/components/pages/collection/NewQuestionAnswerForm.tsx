import { Show, createSignal } from "solid-js";
import { serverUrl } from "../../../lib/serverUrl";
import { useOpenCollection } from "../../../states/useCollection";
import { classNames } from "../../../lib/classNames";
import {
  AnswersT,
  useCollectionQuestionAnswers,
} from "../../../states/useQuestionAnswers";
import LoadingSpinner from "../../LoadingSpinner";
import QuestionAnswerForms from "../../QuestionAnswerForms";
import DeleteIcon from "../../icons/DeleteIcon";
import SaveIcon from "../../icons/SaveIcon";

type PostQuestionAnswersT = {
  collectionId: string;
  questionName: string;
  answers: Array<string>;
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

  const [isBtnLoading, setIsBtnLoading] = createSignal<boolean>(false);
  const [inputAnswer, setInputAnswer] = createSignal<string>("");
  const [isSaveLoading, setIsSaveLoading] = createSignal<boolean>(false);
  const [inputAnswers, setInputAnswers] = createSignal<
    Array<AnswersT | string>
  >([]);
  const [inputQuestion, setInputQuestion] = createSignal<string>("");
  const [error, setError] = createSignal<string>("");
  const [openedNewCollection, setOpenedNewCollection] =
    createSignal<boolean>(false);

  const handleAddAnswer = (e: any) => {
    e.preventDefault();

    if (inputAnswer().trim()) {
      setInputAnswers([...inputAnswers(), inputAnswer()]);
      setInputAnswer("");
    }
  };

  const handleCancel = () => {
    setError("");
    setInputAnswer("");
    setInputAnswers([]);
    setInputQuestion("");
    setOpenedNewCollection(false);
  };

  const handleSave = (e: any) => {
    e.preventDefault();

    if (
      !!inputQuestion().trim() &&
      (!!inputAnswers().length || !!inputAnswer().trim())
    ) {
      setIsSaveLoading(true);
      if (!!inputAnswer().trim()) {
        const updateValues = [...inputAnswers(), inputAnswer()];
        setInputAnswers(updateValues);
        setInputAnswer("");
      }
      const data = {
        collectionId,
        questionName: inputQuestion().trim(),
        answers: inputAnswers(),
      };
      // postQuestionAnswers(data)
      //   .then((res) => {
      //     console.log(res);
      //     setCollectionQuestionAnswers(res.data);
      //     setInputAnswer("");
      //     setInputAnswers([]);
      //     setInputQuestion("");
      //     setIsSaveLoading(false);
      //     setOpenedNewCollection(false);
      //   })
      //   .catch((_) => {
      //     setIsSaveLoading(false);
      //     setError("Something went wrong, please try again later...");
      //   });
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
            question={inputQuestion()}
            answers={inputAnswers()}
            onDeleteAnswer={setInputAnswers}
            onUpdateAnswer={setInputAnswers}
            onAddAnswer={(answer) =>
              setInputAnswers([...inputAnswers(), answer])
            }
          />
          {console.log(inputAnswers())}
          <div class="flex mt-8">
            <button
              title="Save"
              class="grow btn btn-primary no-animation card group rounded-md rounded-r-none"
              // onClick={() => handleCollectionSave()}
            >
              <Show when={isBtnLoading()} fallback={<SaveIcon />}>
                <LoadingSpinner size="default" />
              </Show>
            </button>

            <button
              title="Cancel"
              class="grow btn w-fit no-animation card group rounded-md rounded-l-none"
              onClick={() => setOpenedNewCollection(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </Show>
    </div>
  );
};

export default NewQuestionAnswerForm;
