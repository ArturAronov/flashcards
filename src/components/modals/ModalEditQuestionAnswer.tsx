import { Show, createEffect, createSignal } from "solid-js";
import {
  AnswersT,
  CollectionQuestionAnswersT,
  useCollectionQuestionAnswers,
} from "../../states/useQuestionAnswers";
import { serverUrl } from "../../lib/serverUrl";
import ModalBase from "./ModalBase";
import LoadingSpinner from "../LoadingSpinner";
import QuestionAnswerForms from "../QuestionAnswerForms";
import { createStore } from "solid-js/store";

type PropsT = {
  isModalOpen: boolean;
  activeQuestionAnswer: CollectionQuestionAnswersT | null;
  setActiveQuestionAnswer: (value: string) => void;
  setIsModalOpen: (state: boolean) => void;
};

type NewAnswersT = {
  answers: Array<string>;
  questionId: string;
  collectionId: string;
};

const postNewAnswer = async (data: NewAnswersT) => {
  const response = await fetch(serverUrl + "/answers", {
    mode: "cors",
    method: "post",
    credentials: "include",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });

  return await response.json();
};

const deleteAnswer = async (answerId: string) => {
  const response = await fetch(serverUrl + `/answers/${answerId}`, {
    mode: "cors",
    method: "delete",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  return await response.json();
};

const ModalEditQuestionAnswer = (props: PropsT) => {
  const [_, setCollectionQuestionAnswers] = useCollectionQuestionAnswers();

  const [confirmDelete, setConfirmDelete] = createSignal<boolean>(false);
  const [isSaveLoading, setIsSaveLoading] = createSignal<boolean>(false);
  const [question, setQuestion] = createSignal<string>("");
  const [inputAnswers, setInputAnswers] = createSignal<
    Array<AnswersT | { name: string }>
  >([]);
  const [answers, setAnswers] = createStore<Array<AnswersT | { name: string }>>(
    []
  );

  const handleCancel = () => resetStates();

  const resetStates = () => {
    setQuestion("");
    setInputAnswers([]);
    setConfirmDelete(false);
    setIsSaveLoading(false);
    props.setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (confirmDelete()) {
      // TODO: API handler
      props.setIsModalOpen(false);
      setConfirmDelete(false);
    } else {
      setConfirmDelete(true);
    }
  };

  const handleSave = () => {
    if (!!props.activeQuestionAnswer) {
      setIsSaveLoading(true);
      const newAnswers = inputAnswers()
        .map((answer) => answer.name)
        .filter((answer) => answer.trim());

      if (
        question().length &&
        props.activeQuestionAnswer?.name !== question()
      ) {
        // UPDATE QUESTION
        // TODO: update question
      }

      // ADD ANSWER <===============COMPLETE!!!===============>
      if (newAnswers.length) {
        const data = {
          answers: newAnswers,
          questionId: props.activeQuestionAnswer.questionId,
          collectionId: props.activeQuestionAnswer.collectionId,
        };

        postNewAnswer(data).then((res) => {
          setCollectionQuestionAnswers((collectionQuestionAnswers) =>
            collectionQuestionAnswers.map((element) => {
              if (
                res.data.length &&
                element.questionId === res.data[0].question_id
              ) {
                const updatedAnswers = element.answers;
                res.data.map((e: AnswersT) => updatedAnswers.push(e));
                return { ...element, answers: updatedAnswers };
              } else return element;
            })
          );
        });
      }
    }

    resetStates();
  };

  const handleDeleteAnswer = (answerIndex: number) => {
    const deletedAnswerId = answers[answerIndex] as AnswersT;

    deleteAnswer(deletedAnswerId.id)
      .then((res) => {
        if (res.statusCode === 200) {
          setCollectionQuestionAnswers((collectionQuestionAnswers) =>
            collectionQuestionAnswers.map((element) => {
              if (
                element.questionId === props.activeQuestionAnswer?.questionId
              ) {
                return {
                  ...element,
                  answers: props.activeQuestionAnswer.answers.filter(
                    (answer) => answer.id !== deletedAnswerId.id
                  ),
                };
              } else return element;
            })
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });

    setAnswers(answers.filter((_, index) => index !== answerIndex));
  };

  const updateAnswers = () => {
    const updatedDbAnswers = answers.filter((answer) => {
      const a = answer as AnswersT;
      if (a.id) return a;
    }) as AnswersT[];

    const updatedInputAnswers = answers.filter((answer) => {
      const a = answer as AnswersT;
      if (!a.id) return a;
    });

    setInputAnswers(updatedInputAnswers);
  };

  const handleUpdateAnswers = (
    updatedIndex: number,
    objKey: string,
    updatedAnswer: string
  ) => {
    setAnswers(updatedIndex, objKey as "name", updatedAnswer);
    updateAnswers();
  };

  createEffect(() => {
    if (props.activeQuestionAnswer?.answers[0].id) {
      setAnswers([
        ...props.activeQuestionAnswer?.answers,
        ...inputAnswers().map((e) => e),
      ]);
    } else {
      setAnswers([...inputAnswers().map((e) => e)]);
    }
  });

  return (
    <ModalBase isModalOpen={props.isModalOpen}>
      <Show
        when={
          props.activeQuestionAnswer?.name &&
          props.activeQuestionAnswer.answers.length
        }
        fallback={<></>}
      >
        <QuestionAnswerForms
          question={question() || props.activeQuestionAnswer?.name || ""}
          answers={answers}
          onUpdateQuestion={(question) => setQuestion(question)}
          onDeleteAnswer={(answerIndex) => handleDeleteAnswer(answerIndex)}
          onAddAnswer={(answer) =>
            setInputAnswers([...inputAnswers(), { name: answer }])
          }
          onUpdateAnswer={handleUpdateAnswers}
        />
      </Show>
      <div class="mt-8 hero w-full">
        <div>
          <Show
            when={confirmDelete()}
            fallback={
              <>
                <div
                  title="Cancel Edit"
                  class="btn rounded-r-none no-animation"
                  onClick={() => handleCancel()}
                >
                  Cancel
                </div>
                <button
                  title="Delete Question"
                  class="btn-error btn rounded-none w-44 no-animation"
                  onClick={() => handleDelete()}
                >
                  Delete Question
                </button>
                <button
                  title="Save Changes"
                  class="btn-primary btn rounded-l-none w-20 no-animation"
                  onClick={() => handleSave()}
                >
                  <Show when={isSaveLoading()} fallback="Save">
                    <LoadingSpinner size="default" />
                  </Show>
                </button>
              </>
            }
          >
            <button
              title="Cancel Delete"
              class="btn rounded-r-none no-animation"
              onClick={() => setConfirmDelete(false)}
            >
              Cancel
            </button>
            <button
              title="Confirm Delete"
              class="btn-error btn rounded-l-none no-animation w-64"
              onClick={() => handleDelete()}
            >
              Confirm Delete
            </button>
          </Show>
        </div>
      </div>
    </ModalBase>
  );
};

export default ModalEditQuestionAnswer;
