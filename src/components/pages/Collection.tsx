import { Show, createSignal, onMount } from "solid-js";
import { useParams } from "@solidjs/router";
import { format } from "date-fns";
import { serverUrl } from "../../lib/serverUrl";
import { classNames } from "../../lib/classNames";
import { useCollectionQuestionAnswers } from "../../states/useQuestionAnswers";
import {
  useLoadingOpenCollection,
  useOpenCollection,
} from "../../states/useCollection";

const getCollection = async (collectionId: string) => {
  const response = await fetch(`${serverUrl}/collections/${collectionId}`, {
    mode: "cors",
    method: "get",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  return await response.json();
};

type PostQuestionAnswersT = {
  collectionId: string;
  questionName: string;
  answers: Array<string>;
};

const postQuestionAnswers = async (data: PostQuestionAnswersT) => {
  const response = await fetch(`${serverUrl}/question-answer`, {
    mode: "cors",
    method: "post",
    credentials: "include",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });

  return await response.json();
};

const Collection = () => {
  const params = useParams();
  const { collectionId } = params;

  const [openCollection, setOpenCollection] = useOpenCollection();
  const [loadingOpenCollection, setLoadingOpenCollection] =
    useLoadingOpenCollection();
  const [collectionQuestionAnswers, setCollectionQuestionAnswers] =
    useCollectionQuestionAnswers();

  const [isSaveLoading, setIsSaveLoading] = createSignal<boolean>(false);
  const [isDeleteActive, setIsDeleteActive] = createSignal<boolean>(false);
  const [openedNewCollection, setOpenedNewCollection] =
    createSignal<boolean>(false);
  const [inputAnswer, setInputAnswer] = createSignal<string>("");
  const [inputAnswers, setInputAnswers] = createSignal<Array<string>>([]);
  const [inputQuestion, setInputQuestion] = createSignal<string>("");
  const [error, setError] = createSignal<string>("");

  const handleAddAnswer = (e: any) => {
    e.preventDefault();

    if (inputAnswer().trim()) {
      setInputAnswers([...inputAnswers(), inputAnswer()]);
      setInputAnswer("");
    }
  };

  const handleCancel = () => {
    setError("");
    setInputAnswer("");
    setInputAnswers([]);
    setInputQuestion("");
    setOpenedNewCollection(false);
  };

  const handleSave = (e: any) => {
    e.preventDefault();

    if (
      !!inputQuestion().trim() &&
      (!!inputAnswers().length || !!inputAnswer().trim())
    ) {
      setIsSaveLoading(true);
      if (!!inputAnswer().trim()) {
        const updateValues = [...inputAnswers(), inputAnswer()];
        setInputAnswers(updateValues);
        setInputAnswer("");
      }
      const data = {
        collectionId,
        questionName: inputQuestion().trim(),
        answers: inputAnswers(),
      };
      postQuestionAnswers(data)
        .then((_) => {
          setInputAnswer("");
          setInputAnswers([]);
          setInputQuestion("");
          setIsSaveLoading(false);
          setOpenedNewCollection(false);
        })
        .catch((_) => {
          setIsSaveLoading(false);
          setError("Something went wrong, please try again later...");
        });
    }
  };

  onMount(() => {
    if (!openCollection()?.id || openCollection()?.id !== collectionId) {
      getCollection(collectionId).then((res) => {
        const { collection, questionAnswers } = res.data;
        console.log(res.data);
        // @ts-ignore
        setOpenCollection(collection[0]);
        setLoadingOpenCollection(false);
        setCollectionQuestionAnswers(questionAnswers);
      });
    }
  });

  const handleQuestionDelete = () => {
    if (isDeleteActive()) {
    } else {
      setIsDeleteActive(true);
    }
  };

  const handleQuestionEdit = () => {
    if (isDeleteActive()) {
      setIsDeleteActive(false);
    } else {
    }
  };

  console.log(inputAnswers());
  return (
    <section>
      <Show
        when={
          loadingOpenCollection(true) || openCollection()?.id !== collectionId
        }
        fallback={
          <div class="hero-content flex flex-col">
            <h1 class="text-5xl font-bold mb-8 text-center">
              {openCollection()?.name}
            </h1>
            <div
              class={classNames(
                openedNewCollection()
                  ? "w-80 h-full"
                  : "w-48 h-48 cursor-pointer select-none",
                "card border border-primary/25 hover:shadow-md"
              )}
              onClick={() =>
                !openedNewCollection() && setOpenedNewCollection(true)
              }
            >
              <Show
                when={openedNewCollection()}
                fallback={
                  <div class="card-body text-8xl text-secondary hero">+</div>
                }
              >
                <form>
                  <div class="mx-2 my-3">
                    <span class="label-text">Question</span>
                    <input
                      type="text"
                      value={inputQuestion()}
                      class="input input-bordered w-full focus:border-neutral/50 !outline-none"
                      onChange={(e) => {
                        !!error() && setError("");
                        setInputQuestion(e.currentTarget.value);
                      }}
                    />
                    <span class="label-text mt-2">Answers</span>

                    {inputAnswers().map((element, index) => {
                      return (
                        <div class="flex my-1">
                          <input
                            type="text"
                            value={element}
                            class="input input-bordered w-full focus:border-neutral/50 !outline-none"
                            onChange={(e) => {
                              const updatedInput = inputAnswers().map(
                                (input, inputIndex) => {
                                  if (index === inputIndex)
                                    return (input = e.currentTarget.value);
                                  else return input;
                                }
                              );
                              !!error() && setError("");
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
                  <p class="text-xs text-error font-bold text-center">
                    {error()}
                  </p>
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
                        <span class="loading loading-spinner"></span>
                      </Show>
                    </button>
                  </div>
                </form>
              </Show>
            </div>
          </div>
        }
      >
        <div class="hero">
          <span class="loading loading-spinner loading-lg my-10"></span>
        </div>
      </Show>
      {/* {console.log(collectionQuestionAnswers())} */}
      <Show
        when={collectionQuestionAnswers([]).length}
        fallback={"Nothing Here"}
      >
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
                      {element.answers.map((answer) => {
                        return (
                          <li>
                            <span>{answer}</span>
                            <span class="badge badge-success">
                              {answer.correct}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                    {/* <div class='w-52 h-full border border-base-300 hover:border-base-200 hover:shadow-lg rounded-lg'>
                      <div class='p-2'>
                        <div class='text-sm mb-2'>{`Created on: ${format(new Date(element.date_created), 'dd/MMM/yyyy')}`}</div>
                        <div class="badge text-sm badge-success gap-2 block my-1.5 h-7 text-center pt-1 w-28">
                          {`Correct: ${element.correct_answer}`}
                        </div>
                        <div class="badge text-sm badge-error gap-2 block my-1.5 h-7 text-center pt-1 w-28">
                          {`Wrong: ${element.wrong_answer}`}
                        </div>
                      </div>
                      <div class='w-full'>
                        <button
                          title='Delete'
                          class='no-animation btn btn-error w-1/2 rounded-r-none rounded-tl-none rounded-bl-[7px]'
                          onClick={() => handleQuestionDelete()}
                        >
                          <Show
                            when={!isDeleteActive()}
                            fallback='Confirm'
                          >
                            Delete
                          </Show>
                        </button>
                        <Show
                          when={!isDeleteActive()}
                          fallback={
                            <button
                              title='Edit'
                              class='no-animation btn btn-ghost w-1/2 rounded-l-none rounded-tr-none rounded-br-[7px]'
                              onClick={() => handleQuestionEdit()}
                            >
                              Cancel
                            </button>
                          }
                        >
                          <button
                            title='Edit'
                            class='no-animation btn btn-info w-1/2 rounded-l-none rounded-tr-none rounded-br-[7px]'
                            onClick={() => handleQuestionEdit()}
                          >
                              Edit
                          </button>
                        </Show>
                      </div>
                    </div> */}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Show>
    </section>
  );
};

export default Collection;
