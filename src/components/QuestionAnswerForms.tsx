import { Show, createSignal } from "solid-js";
import { AnswersT } from "../states/useQuestionAnswers";
import DeleteIcon from "./icons/DeleteIcon";

type PropsT = {
  question: string;
  answers: Array<AnswersT | string>;
  onAddAnswer: (answer: AnswersT | string) => void;
  onDeleteAnswer: (answers: Array<AnswersT | string>) => void;
  onUpdateAnswer: (answers: Array<AnswersT | string>) => void;

  // error: string;
  // answers: Array<string>;
  // updateQuestion: (val: string) => void;
  // updateAnswers: () => void;
};

const QuestionAnswerForms = (props: PropsT) => {
  const [answer, setAnswer] = createSignal<string>("");
  const [question, setQuestion] = createSignal<string>(props.question);
  const [answers, setAnswers] = createSignal<Array<AnswersT | string>>(
    props.answers
  );
  const [confirmDelete, setConfirmDelete] = createSignal<boolean>(false);
  const [confirmDeleteByIndex, setConfirmDeleteByIndex] = createSignal<
    number | null
  >(null);

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <span class="label-text">Question</span>
      <input
        type="text"
        value={question()}
        class="input input-bordered w-full border-neutral/50 !outline-none focus:border-neutral"
        onChange={(e) => {
          // !!error && setError("");
          setQuestion(e.currentTarget.value);
        }}
      />
      <div class="divider" />
      {props.answers.map((answer, index) => {
        let _answer;
        const isAnswerString = typeof answer === "string";
        if (isAnswerString) _answer = answer;
        else _answer = answer.name;

        return (
          <div class="flex mt-2 mb-1">
            <input
              type="text"
              value={_answer}
              class="input input-bordered w-full rounded-r-none border-neutral/50 !outline-none focus:border-neutral"
              onChange={(e) => {
                if (isAnswerString) {
                  const updatedAnswer = props.answers.map(
                    (changedAnswer, changedIndex) => {
                      if (changedIndex === index) return e.target.value;
                      else return changedAnswer;
                    }
                  );
                  props.onUpdateAnswer(updatedAnswer);
                } else {
                }
              }}
              // onChange={(e) => {
              //   const updatedInput = answers.map((input, inputIndex) => {
              //     if (index === inputIndex)
              //       return (input = e.currentTarget.value);
              //     else return input;
              //   });
              //   !!error && setError("");
              //   setInputAnswers(updatedInput);
              // }}
            />
            <button
              class="btn btn-error rounded-l-none w-20 no-animation -ml-[1px]"
              onClick={() => {
                if (!confirmDelete()) {
                  setConfirmDelete(true);
                  setConfirmDeleteByIndex(index);
                } else {
                  const updatedAnswers = props.answers.filter(
                    (answer, i) => i !== index && answer
                  );
                  props.onDeleteAnswer(updatedAnswers);
                  setConfirmDeleteByIndex(null);
                  setConfirmDelete(false);
                }
              }}
            >
              <Show
                when={confirmDelete() && confirmDeleteByIndex() === index}
                fallback={<DeleteIcon />}
              >
                Confirm
              </Show>
            </button>
          </div>
        );
      })}
      <div class="flex mt-2">
        <input
          type="text"
          value={answer()}
          class="input input-bordered w-full border-neutral/50 !outline-none rounded-r-none focus:border-neutral"
          onChange={(e) => setAnswer(e.currentTarget.value)}
        />
        <button
          class="btn btn-outline btn-info rounded-l-none no-animation w-20 -ml-[1px]"
          onClick={() => {
            if (answer().trim().length) {
              props.onAddAnswer(answer());
              setAnswer("");
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

/*
    <form>
      <div class="mx-2 my-3">
        <span class="label-text">Question</span>
        <input
          type="text"
          value={question}
          class="input input-bordered w-full focus:border-neutral/50 !outline-none"
          onChange={(e) => {
            !!error && setError("");
            updateQuestion(e.currentTarget.value);
          }}
        />
        <span class="label-text mt-2">Answers</span>

        {answers.map((element, index) => {
          return (
            <div class="flex my-1">
              <input
                type="text"
                value={element}
                class="input input-bordered w-full focus:border-neutral/50 !outline-none"
                onChange={(e) => {
                  const updatedInput = answers.map((input, inputIndex) => {
                    if (index === inputIndex)
                      return (input = e.currentTarget.value);
                    else return input;
                  });
                  !!error && setError("");
                  setInputAnswers(updatedInput);
                }}
              />
            </div>
          );
        })}
        <span class="label-text mt-2">New Answer</span>
        <div class="flex">
          <input
            type="text"
            value={inputAnswer()}
            class="input input-bordered w-full rounded-r-none focus:border-neutral/50 !outline-none"
            onChange={(e) => setInputAnswer(e.currentTarget.value)}
          />
          <button
            class="btn btn-outline btn-info rounded-l-none w-20 no-animation"
            onClick={(e) => handleAddAnswer(e)}
          >
            Add
          </button>
        </div>
      </div>
      <p class="text-xs text-error font-bold text-center">{error()}</p>
      <div class="mt-3 flex">
        <button
          class="btn text-error grow btn-ghost rounded-r-none rounded-tl-none rounded-bl-[15px] no-animation"
          onClick={() => handleCancel()}
        >
          Cancel
        </button>
        <button
          disabled={!!error()}
          type="submit"
          class="btn grow btn-ghost rounded-l-none rounded-tr-none rounded-br-[15px] no-animation"
          onClick={(e) => handleSave(e)}
        >
          <Show when={isSaveLoading()} fallback="Save">
            <LoadingSpinner size="default" />
          </Show>
        </button>
      </div>
    </form>
*/
