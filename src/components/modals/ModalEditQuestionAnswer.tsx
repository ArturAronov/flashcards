import { createStore } from "solid-js/store";
import { on, Show, createEffect, createSignal } from "solid-js";
import {
  AnswersT,
  CollectionQuestionAnswersT,
  useCollectionQuestionAnswers,
} from "../../states/useQuestionAnswers";
import { serverUrl } from "../../lib/serverUrl";
import ModalBase from "./ModalBase";
import LoadingSpinner from "../LoadingSpinner";
import QuestionAnswerForms from "../QuestionAnswerForms";

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

type UpdateQuestionT = {
  name: string;
  questionId: string;
};

const updateQuestion = async (data: UpdateQuestionT) => {
  const response = await fetch(serverUrl + "/questions", {
    mode: "cors",
    method: "put",
    credentials: "include",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });

  return await response.json();
};

const deleteQuestion = async (questionId: string) => {
  const response = await fetch(serverUrl + `/questions/${questionId}`, {
    mode: "cors",
    method: "delete",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  return await response.json();
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

const updateAnswer = async (answers: Array<{ id: string; name: string }>) => {
  const response = await fetch(serverUrl + "/answers/", {
    mode: "cors",
    method: "put",
    credentials: "include",
    body: JSON.stringify({ answers }),
    headers: { "Content-Type": "application/json" },
  });

  return await response.json();
};

const ModalEditQuestionAnswer = (props: PropsT) => {
  const [collectionQuestionAnswers, setCollectionQuestionAnswers] =
    useCollectionQuestionAnswers();

  const [confirmDelete, setConfirmDelete] = createSignal<boolean>(false);
  const [isSaveLoading, setIsSaveLoading] = createSignal<boolean>(false);
  const [question, setQuestion] = createSignal<string>("");
  const [inputAnswers, setInputAnswers] = createSignal<
    Array<AnswersT | { name: string }>
  >([]);
  const [answers, setAnswers] = createStore<Array<AnswersT | { name: string }>>(
    []
  );
  const [answersCache, setAnswersCache] = createSignal<Array<AnswersT>>([]);

  const handleCancel = () => resetStates();

  const resetStates = () => {
    setQuestion("");
    setInputAnswers([]);
    setConfirmDelete(false);
    setIsSaveLoading(false);
    props.setIsModalOpen(false);
  };

  const handleDeleteQuestion = () => {
    if (confirmDelete() && props.activeQuestionAnswer?.questionId) {
      // DELETE QUESTION <===============COMPLETE!!!===============>
      deleteQuestion(props.activeQuestionAnswer.questionId)
        .then((_) => {
          setCollectionQuestionAnswers((collectionQuestionAnswers) =>
            collectionQuestionAnswers.filter(
              (element) =>
                element.questionId !== props.activeQuestionAnswer?.questionId
            )
          );
        })
        .catch((err) => console.log(err));

      props.setIsModalOpen(false);
      setConfirmDelete(false);
    } else {
      setConfirmDelete(true);
    }
  };

  const handleSave = () => {
    if (!!props.activeQuestionAnswer) {
      setIsSaveLoading(true);
      const answersArr = JSON.parse(JSON.stringify(answers));
      const updatedAnswers = [];

      const newAnswers = inputAnswers()
        .map((answer) => answer.name)
        .filter((answer) => answer.trim());

      for (let i = 0; i < answersArr.length; i++) {
        const cacheAnswer = answersCache().find(
          (e) => e.id === answersArr[i].id
        );

        if (
          cacheAnswer &&
          answersArr[i].name.trim() &&
          cacheAnswer.name !== answersArr[i].name
        ) {
          updatedAnswers.push({
            id: answersArr[i].id,
            name: answersArr[i].name,
          });
        }
      }

      // UPDATE ANSWERS <===============COMPLETE!!!===============>
      if (updatedAnswers.length) {
        updateAnswer(updatedAnswers);
        setCollectionQuestionAnswers((collectionQuestionAnswers) =>
          collectionQuestionAnswers.map((element) => {
            if (element.questionId === props.activeQuestionAnswer?.questionId) {
              return { ...element, answers: answersArr };
            } else return element;
          })
        );
      }

      // UPDATE QUESTION <===============COMPLETE!!!===============>
      if (
        question().length &&
        props.activeQuestionAnswer?.name !== question()
      ) {
        const data = {
          questionId: props.activeQuestionAnswer.questionId,
          name: question(),
        };

        updateQuestion(data);

        setCollectionQuestionAnswers((collectionQuestionAnswers) =>
          collectionQuestionAnswers.map((element) => {
            if (element.questionId === props.activeQuestionAnswer?.questionId) {
              return { ...element, name: question() };
            } else return element;
          })
        );
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
    // DELETE ANSWER <===============COMPLETE!!!===============>

    const deletedAnswerId = answers[answerIndex] as AnswersT;
    const updatedCollectionQuestionAnswers = collectionQuestionAnswers([]).map(
      (e) => {
        if (e.questionId === props.activeQuestionAnswer?.questionId) {
          return {
            ...e,
            answers: e.answers.filter(
              (answer) => answer.id !== deletedAnswerId.id
            ),
          };
        } else return e;
      }
    );
    const updatedAnswers = updatedCollectionQuestionAnswers
      .filter((e) => e.questionId === props.activeQuestionAnswer?.questionId)
      .map((e) => e.answers);

    deleteAnswer(deletedAnswerId.id)
      .then((res) => {
        if (res.statusCode === 200) {
          setCollectionQuestionAnswers(updatedCollectionQuestionAnswers);
          setAnswers([...updatedAnswers.flat(), ...inputAnswers()]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    setAnswersCache(updatedAnswers.flat());
  };

  const handleUpdateAnswers = (
    updatedIndex: number,
    objKey: string,
    updatedAnswer: string
  ) => {
    setAnswers(updatedIndex, objKey as "name", updatedAnswer);
  };

  createEffect(
    on(inputAnswers, () => {
      if (props.activeQuestionAnswer?.answers[0]) {
        setAnswers([
          ...props.activeQuestionAnswer?.answers,
          ...inputAnswers().map((e) => e),
        ]);
      } else {
        setAnswers([...inputAnswers().map((e) => e)]);
      }
    })
  );

  createEffect(
    on(answersCache, () => {
      if (!answersCache().length && props.activeQuestionAnswer) {
        setAnswersCache(JSON.parse(JSON.stringify(answers)));
      }
    })
  );

  createEffect(() => {
    if (props.activeQuestionAnswer?.answers[0])
      setAnswers(props.activeQuestionAnswer?.answers);
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
                  onClick={() => handleDeleteQuestion()}
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
              onClick={() => handleDeleteQuestion()}
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
