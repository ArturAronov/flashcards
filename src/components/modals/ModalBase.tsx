import { JSX } from "solid-js";

type PropsT = {
  isModalOpen: boolean;
  children: JSX.Element;
};

const ModalBase = (props: PropsT) => {
  return (
    <dialog class="modal backdrop-blur-[13px]" open={props.isModalOpen}>
      <form method="dialog" class="modal-box">
        {props.children}
      </form>
    </dialog>
  );
};

export default ModalBase;
