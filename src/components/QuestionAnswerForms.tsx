import { For, Show, createSignal } from "solid-js";
import { AnswersT } from "../states/useQuestionAnswers";
import DeleteIcon from "./icons/DeleteIcon";

type PropsT = {
  question: string;
  answers: Array<AnswersT | { name: string }>;
  onUpdateQuestion: (val: string) => void;
  onDeleteAnswer: (deletedIndex: number) => void;
  onAddAnswer: (answer: string) => void;
  onUpdateAnswer: (
    updatedIndex: number,
    objKey: string,
    updatedAnswer: string
  ) => void;
};

const QuestionAnswerForms = (props: PropsT) => {
  const [answerInput, setAnswerInput] = createSignal<string>("");
  const [confirmDelete, setConfirmDelete] = createSignal<boolean>(false);
  const [confirmDeleteByIndex, setConfirmDeleteByIndex] = createSignal<
    number | null
  >(null);

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <span class="label-text">Question</span>
      <input
        type="text"
        value={props.question}
        class="input input-bordered w-full border-neutral/50 !outline-none focus:border-neutral"
        onInput={(e) => props.onUpdateQuestion(e.target.value)}
      />
      <div class="divider" />
      <For each={props.answers}>
        {(answer, index) => {
          return (
            <div class="flex mt-2 mb-1">
              <input
                disabled={index() === confirmDeleteByIndex()}
                type="text"
                value={answer.name}
                class="input input-bordered w-full rounded-r-none border-neutral/50 !outline-none focus:border-neutral truncate"
                onInput={(e) =>
                  props.onUpdateAnswer(index(), "name", e.currentTarget.value)
                }
              />
              <Show
                when={confirmDelete() && confirmDeleteByIndex() === index()}
                fallback={
                  <button
                    title="Delete Questions"
                    class="btn btn-error btn-outline [&>svg]:fill-error [&>svg]:hover:fill-primary-content rounded-l-none w-20 no-animation -ml-[1px]"
                    onClick={() => {
                      setConfirmDelete(true);
                      setConfirmDeleteByIndex(index);
                    }}
                  >
                    <DeleteIcon />
                  </button>
                }
              >
                <button
                  title="Cancel Delete Answer"
                  class="btn no-animation rounded-none text-xs"
                  onClick={() => {
                    setConfirmDelete(false);
                    setConfirmDeleteByIndex(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  title="Confirm Delete Answer"
                  class="btn btn-error w-20 no-animation rounded-l-none -ml-[1px] text-xs"
                  onClick={() => {
                    props.onDeleteAnswer(index());
                    setConfirmDeleteByIndex(null);
                    setConfirmDelete(false);
                  }}
                >
                  Confirm
                </button>
              </Show>
            </div>
          );
        }}
      </For>
      <div class="flex mt-2">
        <input
          type="text"
          value={answerInput()}
          class="input input-bordered w-full border-neutral/50 !outline-none rounded-r-none focus:border-neutral"
          onInput={(e) => setAnswerInput(e.currentTarget.value)}
        />
        <button
          class="btn btn-outline btn-info rounded-l-none no-animation w-20 -ml-[1px] text-xs"
          disabled={!answerInput().trim().length}
          onClick={() => {
            if (answerInput().trim().length) {
              props.onAddAnswer(answerInput());
              setAnswerInput("");
            }
          }}
        >
          Add
        </button>
      </div>
    </form>
  );
};

export default QuestionAnswerForms;
