import { createSignal } from "solid-js";
import { classNames } from "../../../lib/classNames";
import { CollectionQuestionAnswersT } from "../../../states/useQuestionAnswers";
import { serverUrl } from "../../../lib/serverUrl";

type DataT = {
  answers: Array<string>;
  questionId: string;
};

const postUpdateAnswerStats = async ({ answers, questionId }: DataT) => {
  const response = await fetch(serverUrl + `/answers/${questionId}`, {
    mode: "cors",
    method: "post",
    credentials: "include",
    body: JSON.stringify({ answers }),
    headers: { "Content-Type": "application/json" },
  });

  return await response.json();
};

const PlayCard = (props: {
  collectionQuestionAnswers: Array<CollectionQuestionAnswersT>;
}) => {
  const [answers, setAnswers] = createSignal<{ [key: number]: string }>({});
  const [questionIndex, setQuestionIndex] = createSignal<number>(0);

  const incrementIndex = () => {
    if (questionIndex() === props.collectionQuestionAnswers.length - 1) {
      setQuestionIndex(0);
    } else {
      setQuestionIndex((index) => (index += 1));
    }
  };

  const handleSkip = () => incrementIndex();

  const handleSubmit = () => {
    const answersArr = Object.values(answers());
    postUpdateAnswerStats({
      answers: answersArr,
      questionId: props.collectionQuestionAnswers[questionIndex()].questionId,
    });
    // TODO: API handler here
  };

  return (
    <section class="hero text-center">
      <div>
        <h3
          class={classNames(
            props.collectionQuestionAnswers[0].name.length < 5
              ? "text-8xl font-bold"
              : "text-2xl",
            "font-semibold font-question mb-8"
          )}
        >
          {props.collectionQuestionAnswers[questionIndex()].name}
        </h3>
        <form
          class="mb-3"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          {props.collectionQuestionAnswers[questionIndex()].answers.map(
            (answer, index) => {
              return (
                <div class="mb-3">
                  <input
                    type="text"
                    placeholder={`Answer #${index + 1}`}
                    class="input w-64 border-neutral/50 !outline-none focus:border-neutral"
                    onInput={(e) => {
                      setAnswers({
                        ...answers(),
                        [index]: e.currentTarget.value,
                      });
                    }}
                  />
                </div>
              );
            }
          )}
          <div class="flex pt-3">
            <button
              type="button"
              onClick={() => handleSkip()}
              class="no-animation flex-grow btn rounded-r-none"
            >
              Skip
            </button>
            <button
              type="submit"
              class="no-animation flex-grow btn btn-primary rounded-l-none"
              onClick={() => handleSubmit()}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default PlayCard;
