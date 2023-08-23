import { For, Show, createSignal } from "solid-js";
import {
  CollectionQuestionAnswersT,
  useCollectionQuestionAnswers,
} from "../../../states/useQuestionAnswers";
import ModalEditQuestionAnswer from "../../modals/ModalEditQuestionAnswer";
import SettingsIcon from "../../icons/SettingsIcon";

const QuestionAnswerList = () => {
  const [collectionQuestionAnswers, _] = useCollectionQuestionAnswers();

  const [isModalOpen, setIsModalOpen] = createSignal<boolean>(false);
  const [activeQuestionAnswer, setActiveQuestionAnswer] =
    createSignal<CollectionQuestionAnswersT | null>(null);

  return (
    <>
      <ModalEditQuestionAnswer
        isModalOpen={isModalOpen()}
        setIsModalOpen={setIsModalOpen}
        activeQuestionAnswer={activeQuestionAnswer()}
        setActiveQuestionAnswer={setActiveQuestionAnswer}
      />
      <div class="hero">
        <div class="join join-vertical w-full md:w-2/3">
          <For each={collectionQuestionAnswers([])}>
            {(element) => {
              return (
                <div
                  class="collapse collapse-arrow rounded-lg join-item border border-base-300"
                  onClick={() => setActiveQuestionAnswer(element)}
                >
                  <input
                    type="radio"
                    name="question-answers"
                    checked={
                      activeQuestionAnswer()?.questionId === element.questionId
                    }
                  />
                  <div class="collapse-title text-xl font-semibold font-question">
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
                      class="btn rounded-none no-animation"
                      onClick={() => setIsModalOpen(true)}
                    >
                      <SettingsIcon />
                    </button>
                  </Show>
                  <ul class="collapse-content">
                    <For each={element.answers}>
                      {(answer, index) => (
                        <>
                          <Show when={!!answer} fallback={<></>}>
                            <li>
                              <Show
                                when={index()}
                                fallback={
                                  <div class="border-top border-[0.5px] border-base-300 -mx-4" />
                                }
                              >
                                <div class="mt-5">
                                  <div class="border-bottom border-[0.5px] border-base-300 -mx-4" />
                                </div>
                              </Show>
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
                          </Show>
                        </>
                      )}
                    </For>
                  </ul>
                </div>
              );
            }}
          </For>
        </div>
      </div>
    </>
  );
};

export default QuestionAnswerList;
