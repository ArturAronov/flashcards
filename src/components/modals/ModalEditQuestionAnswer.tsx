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
  // const [_, setCollectionQuestionAnswers] = useCollectionQuestionAnswers();
  const [collectionQuestionAnswers, setCollectionQuestionAnswers] =
    useCollectionQuestionAnswers();

  const [confirmDelete, setConfirmDelete] = createSignal<boolean>(false);
  const [isSaveLoading, setIsSaveLoading] = createSignal<boolean>(false);
  const [answers, setAnswers] = createSignal<
    Array<AnswersT | { name: string }>
  >([]);
  const [dbAnswers, setDbAnswers] = createSignal<Array<AnswersT>>([]);
  const [inputAnswers, setInputAnswers] = createStore<
    Array<AnswersT | { name: string }>
  >([]);

  const handleDelete = () => {
    if (confirmDelete()) {
      // TODO: API handler
      props.setIsModalOpen(false);
      setConfirmDelete(false);
    } else {
      setConfirmDelete(true);
    }
  };

  const handleCancel = () => {
    setInputAnswers([]);
    setConfirmDelete(false);
    props.setIsModalOpen(false);
  };

  const handleSave = () => {
    if (
      props.activeQuestionAnswer?.questionId &&
      props.activeQuestionAnswer?.collectionId
    ) {
      setIsSaveLoading(true);
      const data = {
        answers: inputAnswers.map((element) => element.name),
        questionId: props.activeQuestionAnswer.questionId,
        collectionId: props.activeQuestionAnswer.collectionId,
      };
      postNewAnswer(data).then((res) => {
        setCollectionQuestionAnswers((collectionQuestionAnswers) =>
          collectionQuestionAnswers.map((element) => {
            if (element.questionId === res.data[0].question_id) {
              const updatedAnswers = element.answers;
              res.data.map((e: AnswersT) => updatedAnswers.push(e));
              return { ...element, answers: updatedAnswers };
            } else return element;
          })
        );
        setIsSaveLoading(false);
        props.setIsModalOpen(false);
      });
    }
  };

  const handleDeleteAnswer = (answerIndex: number) => {
    // Move this to Save section START
    const deleteDbAnswer = answers()[answerIndex] as AnswersT;
    if (deleteDbAnswer?.id) {
      deleteAnswer(deleteDbAnswer.id);
    }
    setAnswers(answers().filter((_, index) => index !== answerIndex));

    setCollectionQuestionAnswers((collectionQuestionAnswers) =>
      collectionQuestionAnswers.filter((_, index) => index !== answerIndex)
    );
    // Move this to Save section END

    const updatedDbAnswers = answers().filter((answer) => {
      const a = answer as AnswersT;
      if (a.id) return a;
    }) as AnswersT[];

    const updatedInputAnswers = answers().filter((answer) => {
      const a = answer as AnswersT;
      if (!a.id) return a;
    });

    setDbAnswers(updatedDbAnswers);
    setInputAnswers(updatedInputAnswers);
  };

  createEffect(() => {
    if (props.activeQuestionAnswer?.answers) {
      setDbAnswers(props.activeQuestionAnswer.answers);
      setAnswers([
        ...props.activeQuestionAnswer?.answers,
        ...inputAnswers.map((e) => e),
      ]);
    } else {
      setAnswers([...inputAnswers.map((e) => e)]);
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
          question={props.activeQuestionAnswer?.name || ""}
          answers={answers()}
          onAddAnswer={(answer) =>
            setInputAnswers([...inputAnswers, { name: answer }])
          }
          onDeleteAnswer={(answerIndex) => handleDeleteAnswer(answerIndex)}
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
                <div
                  title="Delete Question"
                  class="btn-error btn rounded-none w-44 no-animation"
                  onClick={() => handleDelete()}
                >
                  Delete Question
                </div>
                <div
                  title="Save Changes"
                  class="btn-primary btn rounded-l-none w-20 no-animation"
                  onClick={() => {
                    handleSave();
                    setInputAnswers([]);
                  }}
                >
                  <Show when={isSaveLoading()} fallback="Save">
                    <LoadingSpinner size="default" />
                  </Show>
                </div>
              </>
            }
          >
            <div
              title="Cancel Delete"
              class="btn rounded-r-none no-animation"
              onClick={() => setConfirmDelete(false)}
            >
              Cancel
            </div>
            <div
              title="Confirm Delete"
              class="btn-error btn rounded-l-none no-animation w-64"
              onClick={() => handleDelete()}
            >
              Confirm Delete
            </div>
          </Show>
        </div>
      </div>
    </ModalBase>
  );
};

export default ModalEditQuestionAnswer;
