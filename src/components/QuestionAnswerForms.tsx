import {
  For,
  Index,
  Show,
  createComputed,
  createEffect,
  createSignal,
} from "solid-js";
import { AnswersT } from "../states/useQuestionAnswers";
import DeleteIcon from "./icons/DeleteIcon";

type PropsT = {
  question: string;
  answers: Array<AnswersT | string>;
  onUpdateQuestion: (val: string) => void;
  onDeleteAnswer: (deletedIndex: number) => void;
  onAddAnswer: (answer: AnswersT | string) => void;
  onUpdateAnswer: (updatedAnswer: string, updatedIndex: number) => void;
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
      <For each={props.answers} fallback={""}>
        {(answer, index) => {
          console.log(answer);
          let _answer;
          const isAnswerString = typeof answer === "string";
          if (isAnswerString) _answer = answer;
          else _answer = answer.name;

          return (
            <div class="flex mt-2 mb-1">
              <input
                disabled={index() === confirmDeleteByIndex()}
                type="text"
                value={_answer}
                class="input input-bordered w-full rounded-r-none border-neutral/50 !outline-none focus:border-neutral truncate"
                onInput={(e) =>
                  props.onUpdateAnswer(e.currentTarget.value, index())
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
                    // const updatedAnswers = props.answers.filter(
                    //   (answer, i) => i !== index && answer
                    // );
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
