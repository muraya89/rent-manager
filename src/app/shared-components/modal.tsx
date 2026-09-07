import { ReactElement, ReactNode, useState } from "react";
import { Modal } from "reactstrap";

type CustomModalProps = {
  trigger: (props: { onClick: () => void }) => ReactElement;
  children: ReactNode | ((props: { toggle: () => void }) => ReactNode);
};

export default function CustomModal({ trigger, children }: CustomModalProps) {
  const [modal, setModal] = useState(false);
  const toggle = () => setModal((current) => !current);
  return (
    <div>
      {trigger({ onClick: toggle })}
      <Modal isOpen={modal} toggle={toggle}>
        {typeof children === "function" ? children({ toggle }) : children}
      </Modal>
    </div>
  );
}
