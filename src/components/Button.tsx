import tw, { styled } from "twin.macro";

import { AccentSection } from "./Section";
import { Wrapper as ModalWrapper } from "./Modal";

type ButtonStyleProps = {
  variant?: "primary" | "secondary";
};
const Button = styled.button<ButtonStyleProps>`
  ${tw`inline-flex items-center justify-center p-2 rounded `};
  > svg {
    margin-left: 10px;
  }
  ${({ variant = "primary" }) =>
    variant === "primary"
      ? tw`bg-primary text-white`
      : tw`bg-secondary text-black`};

  ${AccentSection} & {
    ${({ variant = "primary" }) =>
      variant === "primary"
        ? tw`bg-primary text-white`
        : tw`bg-black text-secondary`};
  }

  ${ModalWrapper} & {
    ${tw`w-40 py-4 border border-primary`};
    ${({ variant = "primary" }) =>
      variant === "primary"
        ? tw`bg-primary text-white`
        : tw`bg-white text-primary `}
  }
`;

export default Button;
