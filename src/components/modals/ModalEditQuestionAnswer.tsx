import { createStore } from "solid-js/store";
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

const boobs = [
  {
    questionId: "3515f72d-ef9b-41bf-8d3b-a3604b5179e9",
    name: "Question nr 1",
    collectionId: "8a475495-b9e2-4fa0-a634-235951691018",
    date_created: "2023-08-08T22:28:25.937Z",
    answers: [
      {
        id: "882f610e-935f-450c-8004-871c37bae5e8",
        name: "Hello World",
        wrong: 0,
        correct: 0,
        skipped: 0,
      },
    ],
  },
  {
    questionId: "666ce232-3b97-4ac8-9631-18686aff3177",
    name: "Updated Question",
    collectionId: "8a475495-b9e2-4fa0-a634-235951691018",
    date_created: "2023-08-08T22:08:59.100Z",
    answers: [
      {
        id: "70521cdf-58ec-42ac-b6b0-d63228ee2024",
        name: "Goodbye World",
        wrong: 0,
        correct: 0,
        skipped: 0,
      },
    ],
  },
  {
    questionId: "a2dd2ebe-ed94-4918-ad9e-299dfe3680c3",
    name: "Question with no answers",
    collectionId: "8a475495-b9e2-4fa0-a634-235951691018",
    date_created: "2023-08-08T22:41:30.920Z",
    answers: [
      {
        id: "638e80da-5f7e-4410-b2e4-7abf30cae823",
        name: "7a",
        wrong: 0,
        correct: 0,
        skipped: 0,
      },
      {
        id: "1d5fcf84-bf09-460d-af1d-79233f158a09",
        name: "8a",
        wrong: 0,
        correct: 0,
        skipped: 0,
      },
      {
        id: "ac595656-5d33-4d91-b711-9d12a50caab7",
        name: "9a",
        wrong: 0,
        correct: 0,
        skipped: 0,
      },
    ],
  },
];

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
          setAnswers(updatedAnswers.flat());
        }
      })
      .catch((err) => {
        console.log(err);
      });
    setAnswersCache(updatedAnswers.flat());
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
    // updateAnswers();
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

    if (!answersCache().length && props.activeQuestionAnswer) {
      setAnswersCache(JSON.parse(JSON.stringify(answers)));
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
