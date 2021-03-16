import tw, { styled } from "twin.macro";

import { AccentSection } from "./Section";

type ButtonStyleProps = {
  variant?: "primary" | "secondary";
};
const Button = styled.button<ButtonStyleProps>`
  ${tw`inline-flex items-center p-2 rounded`}
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
  > svg {
    margin-left: 10px;
  }
`;

export default Button;
