import { Show, createSignal, onMount } from "solid-js";
import { useParams } from "@solidjs/router";
import { serverUrl } from "../../lib/serverUrl";
import { useLoadingOpenCollection, useOpenCollection } from "../../states/useCollection";
import { classNames } from "../../lib/classNames";

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
  collectionId: string,
  questionName: string
  answers: Array<string>
}

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
  const [loadingOpenCollection, setLoadingOpenCollection] = useLoadingOpenCollection();

  const [isSaveLoading, setIsSaveLoading] =
    createSignal<boolean>(false);
  const [openedNewCollection, setOpenedNewCollection] =
    createSignal<boolean>(false);
    const [inputAnswer, setInputAnswer] =
    createSignal<string>('');
  const [inputAnswers, setInputAnswers] =
    createSignal<Array<string>>([]);
  const [inputQuestion, setInputQuestion] =
    createSignal<string>('');
  const [error, setError] = createSignal<string>('')

  onMount(() => {
    if (!openCollection()?.id || openCollection()?.id !== collectionId) {
      getCollection(collectionId).then(res => {
        const collection = res.data.collection[0]
        const questions = res.data.questions
        const answers = res.data.answers

        // @ts-ignore
        setOpenCollection(collection)
        setLoadingOpenCollection(false)
      })
    }
  });

  const handleAddAnswer = (e: any) => {
    e.preventDefault()

    if(inputAnswer().trim()){
      setInputAnswers([...inputAnswers(), inputAnswer()])
      setInputAnswer('')
    }
  }

  const handleCancel = () => {
        setError('')
        setInputAnswer('')
        setInputAnswers([])
        setInputQuestion('')
        setOpenedNewCollection(false)
  }

  const handleSave = (e: any) => {
    e.preventDefault()

    if(!!inputQuestion().trim() && (!!inputAnswers().length || !!inputAnswer().trim())) {
      setIsSaveLoading(true)
      if(!!inputAnswer().trim()) {
        const updateValues = [...inputAnswers(), inputAnswer()]
        setInputAnswers(updateValues)
        setInputAnswer('')
      }
      const data = {
        collectionId,
        questionName: inputQuestion().trim(),
        answers:inputAnswers()
      }
      postQuestionAnswers(data).then(_ => {
        setInputAnswer('')
        setInputAnswers([])
        setInputQuestion('')
        setIsSaveLoading(false)
        setOpenedNewCollection(false)
      }).catch(_ => {
        setIsSaveLoading(false)
        setError('Something went wrong, please try again later...')
      })
    }
  }


  return (
    <section class='hero'>
      <Show
        when={loadingOpenCollection(true) || openCollection()?.id !== collectionId}
        fallback={
          <div class='hero-content flex flex-col'>
            <h1 class="text-5xl font-bold mb-8 text-center">{openCollection()?.name}</h1>
            <div
              class={classNames(
                openedNewCollection()
                  ? "w-80 h-full"
                  : "w-48 h-48 cursor-pointer select-none",
                "card border border-primary/25 hover:shadow-lg"
              )}
              onClick={() => !openedNewCollection() && setOpenedNewCollection(true)}
            >
              <Show
                when={openedNewCollection()}
                fallback={<div class="card-body text-8xl text-secondary hero">+</div>}
              >
                <form>
                  <div class='mx-2 my-3'>
                  <span class="label-text">Question</span>
                  <input
                    type="text"
                    value={inputQuestion()}
                    class="input input-bordered w-full focus:border-neutral/50 !outline-none"
                    onChange={(e) => {
                      !!error() && setError('')
                      setInputQuestion(e.currentTarget.value)
                    }}
                  />
                  <span class="label-text mt-2">Answers</span>
                    {inputAnswers().map((element, index) => {
                      return(
                        <div class='flex my-1'>
                          <input
                            type="text"
                            value={element}
                            class="input input-bordered w-full focus:border-neutral/50 !outline-none"
                            onChange={(e) => {
                              const updatedInput = inputAnswers().map((input, inputIndex) => {
                                if(index === inputIndex) return input = e.currentTarget.value
                                else return input
                              })
                              !!error() && setError('')
                              setInputAnswers(updatedInput)
                            }}
                          />
                        </div>
                      )
                    })}
                    <span class="label-text mt-2">New Answer</span>
                    <div class='flex'>
                      <input
                        type="text"
                        value={inputAnswer()}
                        class="input input-bordered w-full rounded-r-none focus:border-neutral/50 !outline-none"
                        onChange={(e) =>
                          setInputAnswer(e.currentTarget.value)
                        }
                      />
                      <button
                        class='btn btn-outline btn-info rounded-l-none w-20 no-animation'
                        onClick={(e) => handleAddAnswer(e)}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                  <p class="text-xs text-error font-bold text-center">{error()}</p>
                  <div class='mt-3 flex'>
                    <button
                      class='btn text-error grow btn-ghost rounded-r-none rounded-tl-none rounded-bl-[15px] no-animation'
                      onClick={() => handleCancel()}
                    >
                      Cancel
                    </button>
                    <button
                      disabled={!!error()}
                      type="submit"
                      class='btn grow btn-ghost rounded-l-none rounded-tr-none rounded-br-[15px] no-animation'
                      onClick={(e) => handleSave(e)}
                    >
                      <Show
                        when={isSaveLoading()}
                        fallback='Save'
                      >
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
        <span class="loading loading-spinner loading-lg my-10"></span>
      </Show>
    </section>
  )
};

export default Collection;
