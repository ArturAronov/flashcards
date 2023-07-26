import { Show, createSignal } from "solid-js";
import { useCollectionQuestionAnswers } from "../../../states/useQuestionAnswers";
import SettingsIcon from "../../Icons/SettingsIcon";
import { classNames } from "../../../lib/classNames";
import SaveIcon from "../../Icons/SaveIcon";
import DeleteIcon from "../../Icons/DeleteIcon";

const QuestionAnswerList = () => {
  const [collectionQuestionAnswers, _] = useCollectionQuestionAnswers();

  const [isDeleteActive, setIsDeleteActive] = createSignal(false);
  const [activeEditId, setActiveEditId] = createSignal<string>("");
  const [activeAnswerValue, setActiveAnswerValue] = createSignal("");

  return (
    <Show when={collectionQuestionAnswers([]).length} fallback={"Nothing Here"}>
      <div class="hero">
        <div class="join join-vertical w-full md:w-2/3">
          {collectionQuestionAnswers([]).map((element) => {
            return (
              <div class="collapse collapse-arrow join-item border border-base-300">
                <input type="radio" name="question-answers" checked />
                <div class="collapse-title text-xl font-medium">
                  {element.name}
                </div>
                {/* <div class="collapse-content flex justify-between w-full"> */}
                <ul class="collapse-content">
                  {element.answers.map((answer, index) => {
                    return (
                      <li
                        class={classNames(
                          index === 0
                            ? "rounded-t"
                            : index === element.answers.length - 1
                            ? "rounded-b rounded-t-none"
                            : "rounded-none",
                          "border p-2 grow"
                        )}
                      >
                        <div
                          class={classNames(
                            !activeEditId() && "flex",
                            "md:flex"
                          )}
                        >
                          <Show
                            when={activeEditId() === answer.id}
                            fallback={
                              <p class="mt-3 mb-5 w-full ml-[17px]">
                                {answer.name}
                              </p>
                            }
                          >
                            <input
                              type="text"
                              value={activeAnswerValue()}
                              class="input w-full input-bordered grow border-neutral/50 focus:border-neutral !outline-none mb-2 mr-2"
                            ></input>
                          </Show>
                          <Show
                            when={activeEditId() === answer.id}
                            fallback={
                              <button
                                title="Edit"
                                class="btn btn-ghost no-animation w-fit"
                                onClick={() => {
                                  setActiveAnswerValue(answer.name);
                                  setActiveEditId(answer.id);
                                }}
                              >
                                <SettingsIcon />
                              </button>
                            }
                          >
                            <div class="flex">
                              <Show
                                when={isDeleteActive()}
                                fallback={
                                  <div class="flex w-full flex-nowrap">
                                    <button
                                      title="Delete"
                                      class="btn grow md:grow-0 btn-error no-animation card group rounded-l-lg rounded-r-none"
                                      onClick={() => setIsDeleteActive(true)}
                                    >
                                      <DeleteIcon />
                                    </button>
                                    <button
                                      title="Save"
                                      class="btn grow md:grow-0 btn-primary no-animation card group rounded-none"
                                      // onClick={() => handleCollectionSave()}
                                    >
                                      <SaveIcon />
                                    </button>
                                  </div>
                                }
                              >
                                <button
                                  title="Confirm Delete"
                                  class="btn grow md:grow-0 btn-error no-animation card group rounded-l-lg rounded-r-none"
                                  // onClick={() => setIsDeleteActive(true)}
                                >
                                  Confirm
                                </button>
                              </Show>
                              <button
                                title="Delete"
                                class="btn w-fit no-animation card group rounded-r-lg rounded-l-none"
                                onClick={() => {
                                  setActiveEditId("");
                                  setActiveAnswerValue("");
                                  setIsDeleteActive(false);
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          </Show>
                        </div>
                        <div class="flex justify-between md:block mt-2 md:mt-0">
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
  );
};

export default QuestionAnswerList;
