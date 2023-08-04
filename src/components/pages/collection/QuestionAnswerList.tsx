import { Show, createSignal } from "solid-js";
import {
  CollectionQuestionAnswersT,
  useCollectionQuestionAnswers,
} from "../../../states/useQuestionAnswers";
import SettingsIcon from "../../icons/SettingsIcon";
import { classNames } from "../../../lib/classNames";
import SaveIcon from "../../icons/SaveIcon";
import DeleteIcon from "../../icons/DeleteIcon";
import QuestionAnswerForms from "../../QuestionAnswerForms";
import ModalEditQuestionAnswer from "../../modals/ModalEditQuestionAnswer";

const QuestionAnswerList = () => {
  const [collectionQuestionAnswers, _] = useCollectionQuestionAnswers();

  const [isModalOpen, setIsModalOpen] = createSignal<boolean>(false);
  // const [activeQuestion, setActiveQuestion] = createSignal<string>("");
  const [activeQuestionAnswer, setActiveQuestionAnswer] =
    createSignal<CollectionQuestionAnswersT | null>(null);

  return (
    <>
      <ModalEditQuestionAnswer
        isModalOpen={isModalOpen()}
        activeQuestionAnswer={activeQuestionAnswer()}
        setActiveQuestionAnswer={setActiveQuestionAnswer}
        setIsModalOpen={setIsModalOpen}
      />
      <Show
        when={collectionQuestionAnswers([]).length}
        fallback={"Nothing Here"}
      >
        <div class="hero">
          <div class="join join-vertical w-full md:w-2/3">
            {collectionQuestionAnswers([]).map((element) => {
              return (
                <div
                  class="collapse collapse-arrow join-item border border-base-300"
                  onClick={() => setActiveQuestionAnswer(element)}
                >
                  <input type="radio" name="question-answers" checked />
                  <div class="collapse-title text-xl font-medium">
                    {element.name}
                  </div>
                  <Show
                    when={
                      activeQuestionAnswer()?.questionId === element.questionId
                    }
                    fallback={<></>}
                  >
                    <div class="border-t" />
                    <button
                      class="btn btn-ghost rounded-none"
                      onClick={() => setIsModalOpen(true)}
                    >
                      <SettingsIcon />
                    </button>
                  </Show>
                  <ul class="collapse-content">
                    {element.answers.map((answer, index) => {
                      return (
                        <li>
                          {index ? <div class="divider" /> : <></>}
                          <div class="flex justify-between mb-3">
                            <p class="py-3 mr-3">{answer.name}</p>
                          </div>
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
                  {/* </div> */}
                </div>
              );
            })}
          </div>
        </div>
      </Show>
    </>
  );
};

export default QuestionAnswerList;
