import React from "react";
import tw, { styled } from "twin.macro";
import { Dialog, DialogContent, DialogOverlay } from "@reach/dialog";

import Portal from "./Portal";
import { Times } from "../assets/icons";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

// const ModalComponent: React.ForwardRefRenderFunction<
//   HTMLElement,
//   React.PropsWithChildren<ModalProps>
// > = ({ children, isOpen, onClose }, externalRef) => {
//   if (!isOpen) {
//     return null;
//   }
//   return (
//     <Portal>
//       <DialogOverlay ref={externalRef}>
//         <ExitButton onClick={onClose}>
//           <Times />
//         </ExitButton>
//         <Content>{children}</Content>
//       </DialogOverlay>
//       <BgBlur />
//     </Portal>
//   );
// };
//const Modal = React.forwardRef(ModalComponent);

const Modal: React.FC<ModalProps> = ({ children, isOpen, onClose }) => {
  return (
    <Overlay isOpen={isOpen} onDismiss={onClose}>
      <Wrapper>
        <ExitButton onClick={onClose}>
          <Times />
        </ExitButton>
        <Content>{children}</Content>
      </Wrapper>
    </Overlay>
  );
};

//Modal.displayName = "Modal";
export default Modal;

const Overlay = tw(DialogOverlay)`
   fixed inset-0 bg-black bg-opacity-50 overflow-auto
`;
export const Wrapper = styled(DialogContent)`
  ${tw`bg-white rounded border border-opacity-10 mx-auto mt-20 p-5 max-w-max flex flex-col items-center`};
`;

const Content = tw.div`pb-7 px-5`;

const ExitButton = tw.button`w-4 h-4 text-gray self-end`;
