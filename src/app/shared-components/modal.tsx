import { ReactNode } from "react";
import { Modal } from "reactstrap";

export default function CustomModal({
  isOpen,
  children,
}: {
  isOpen: boolean;
  children: ReactNode;
}) {
  return <Modal isOpen={isOpen}>{children}</Modal>;
}
