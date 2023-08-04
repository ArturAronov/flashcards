import { CollectionQuestionAnswersT } from "../../states/useQuestionAnswers";
import QuestionAnswerForms from "../QuestionAnswerForms";
import ModalBase from "./ModalBase";

type PropsT = {
  isModalOpen: boolean;
  activeQuestionAnswer: CollectionQuestionAnswersT | null;
  setActiveQuestionAnswer: (value: string) => void;
  setIsModalOpen: (state: boolean) => void;
};

const ModalEditQuestionAnswer = (props: PropsT) => {
  return (
    <ModalBase isModalOpen={props.isModalOpen}>
      <QuestionAnswerForms
        question={props.activeQuestionAnswer?.name || ""}
        answers={props.activeQuestionAnswer?.answers || []}
        // updateQuestion={props.setActiveQuestionAnswer}
      />
      <div class="modal-action">
        <button class="btn" onClick={() => props.setIsModalOpen(false)}>
          Close
        </button>
      </div>
    </ModalBase>
  );
};

export default ModalEditQuestionAnswer;
