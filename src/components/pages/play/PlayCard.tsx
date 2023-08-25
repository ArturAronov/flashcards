import { For, Show, createSignal } from "solid-js";
import { serverUrl } from "../../../lib/serverUrl";
import { classNames } from "../../../lib/classNames";
import { autofocus } from "@solid-primitives/autofocus";
import {
  AnswersT,
  CollectionQuestionAnswersT,
} from "../../../states/useQuestionAnswers";
import LoadingSpinner from "../../LoadingSpinner";

const postCorrectAnswerStats = async (answers: Array<AnswersT>) => {
  const response = await fetch(serverUrl + "/answers/correct", {
    mode: "cors",
    method: "post",
    credentials: "include",
    body: JSON.stringify({ answers }),
    headers: { "Content-Type": "application/json" },
  });

  return await response.json();
};

const postWrongAnswerStats = async (answers: Array<AnswersT>) => {
  const response = await fetch(serverUrl + "/answers/wrong", {
    mode: "cors",
    method: "post",
    credentials: "include",
    body: JSON.stringify({ answers }),
    headers: { "Content-Type": "application/json" },
  });

  return await response.json();
};

const postSkippedAnswerStats = async (answers: Array<AnswersT>) => {
  const response = await fetch(serverUrl + "/answers/skip", {
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
  // prevents from being tree-shaken by TS
  autofocus;

  const [questionIndex, setQuestionIndex] = createSignal<number>(0);
  const [isBtnsDisabled, setIsBtnsDisabled] = createSignal<boolean>(false);
  const [isAnswerVisible, setIsAnswerVisible] = createSignal<boolean>(false);
  const [answers, setAnswers] = createSignal<{ [key: number]: string }>({});

  const incrementIndex = () => {
    if (questionIndex() === props.collectionQuestionAnswers.length - 1) {
      setQuestionIndex(0);
    } else {
      setQuestionIndex((index) => (index += 1));
    }
  };

  const handleSkip = async () => {
    setIsBtnsDisabled(true);
    setAnswers({});
    setIsAnswerVisible(true);
    await postSkippedAnswerStats(
      props.collectionQuestionAnswers[questionIndex()].answers
    ).then((_) => {
      setTimeout(() => {
        setIsAnswerVisible(false);
        setIsBtnsDisabled(false);
        incrementIndex();
      }, 2000);
    });
  };

  const handleSubmit = async () => {
    setIsBtnsDisabled(true);

    const dbAnswers = props.collectionQuestionAnswers[questionIndex()].answers;
    const answersArr = Object.values(answers());
    const correctAnswers = dbAnswers.filter((answer) =>
      answersArr.includes(answer.name)
    );
    const wrongAnswers = dbAnswers.filter(
      (answer) => !answersArr.includes(answer.name)
    );
    setIsAnswerVisible(true);

    await postWrongAnswerStats(wrongAnswers);
    await postCorrectAnswerStats(correctAnswers).then((_) => {
      setTimeout(() => {
        setIsAnswerVisible(false);
        setIsBtnsDisabled(false);
        setAnswers({});
        incrementIndex();
      }, 2000);
    });
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
          <For each={props.collectionQuestionAnswers[questionIndex()].answers}>
            {(answer, index) => {
              return (
                <div class="mb-3">
                  <Show
                    when={isAnswerVisible()}
                    fallback={
                      <input
                        autofocus={index() === 0}
                        use:autofocus
                        type="text"
                        value={answers()[index()] || ""}
                        placeholder={`Answer #${index() + 1}`}
                        class="input w-64 border-neutral/50 !outline-none focus:border-neutral"
                        onInput={(e) => {
                          setAnswers({
                            ...answers(),
                            [index()]: e.currentTarget.value,
                          });
                        }}
                      />
                    }
                  >
                    <input
                      type="text"
                      disabled={true}
                      value={`${
                        Object.values(answers()).includes(answer.name)
                          ? "✅"
                          : "❎"
                      } ${answer.name}`}
                      placeholder={`Answer #${index() + 1}`}
                      class={classNames(
                        Object.values(answers()).includes(answer.name)
                          ? "!text-primary"
                          : "!text-error",
                        "input w-64 border-neutral/50 !outline-none focus:border-neutral"
                      )}
                    />
                  </Show>
                </div>
              );
            }}
          </For>
          <div class="flex pt-3">
            <button
              disabled={isBtnsDisabled()}
              type="button"
              onClick={() => handleSkip()}
              class="no-animation flex-grow btn rounded-r-none"
            >
              <Show
                when={!isBtnsDisabled()}
                fallback={<LoadingSpinner size="default" />}
              >
                Skip
              </Show>
            </button>
            <button
              disabled={isBtnsDisabled()}
              type="submit"
              class="no-animation flex-grow btn btn-primary rounded-l-none"
              onClick={() => handleSubmit()}
            >
              <Show
                when={!isBtnsDisabled()}
                fallback={<LoadingSpinner size="default" />}
              >
                Submit
              </Show>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default PlayCard;
