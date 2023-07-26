import { Show } from "solid-js";
import { useCollectionQuestionAnswers } from "../../../states/useQuestionAnswers";

const QuestionAnswerList = () => {
  const [collectionQuestionAnswers, _] = useCollectionQuestionAnswers();

  return (
    <Show when={collectionQuestionAnswers([]).length} fallback={"Nothing Here"}>
      <div class="hero">
        <div class="join join-vertical w-2/3">
          {collectionQuestionAnswers([]).map((element) => {
            return (
              <div class="collapse collapse-arrow join-item border border-base-300">
                <input type="radio" name="question-answers" />
                <div class="collapse-title text-xl font-medium">
                  {element.name}
                </div>
                <div class="collapse-content flex justify-between">
                  <ul>
                    {element.answers.map((answer, index) => {
                      return (
                        <li>
                          <Show when={index} fallback={""}>
                            <div class="divider" />
                          </Show>
                          <span>{answer.name}</span>

                          <div>
                            <span class="badge badge-success mr-1">
                              {`correct: ${answer.correct}`}
                            </span>
                            <span class="badge badge-info mr-1">
                              {`skipped: ${answer.skipped}`}
                            </span>
                            <span class="badge badge-error">
                              {`wrong: ${answer.wrong}`}
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Show>
  );
};

export default QuestionAnswerList;
