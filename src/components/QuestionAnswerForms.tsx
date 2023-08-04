import { createSignal } from "solid-js";
import { AnswersT } from "../states/useQuestionAnswers";

type PropsT = {
  question: string;
  answers: Array<AnswersT>;
  // error: string;
  // answers: Array<string>;
  // updateQuestion: (val: string) => void;
  // updateAnswers: () => void;
};

const QuestionAnswerForms = (props: PropsT) => {
  const [question, setQuestion] = createSignal<string>(props.question);
  const [answers, setAnswers] = createSignal<Array<AnswersT> | string>(
    props.answers
  );

  return (
    <form>
      <span class="label-text">Question</span>
      <input
        type="text"
        value={question()}
        class="input input-bordered w-full focus:border-neutral/50 !outline-none"
        onChange={(e) => {
          // !!error && setError("");
          setQuestion(e.currentTarget.value);
        }}
      />
      <div class="divider" />
      {props.answers.map((answer) => {
        return (
          <div class="flex my-1">
            <input
              type="text"
              value={answer.name}
              class="input input-bordered w-full focus:border-neutral/50 !outline-none mt-2"
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
          </div>
        );
      })}
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
