import tw, { styled } from "twin.macro";

const MaxWidthWrapper = tw.div`w-full max-w-screen-xl mx-auto`;
const TextWrapper = styled.div`
  ${tw`text-left w-full max-w-prose text-lg leading-relaxed mx-auto px-9`}
  > p + p {
    margin-top: 1em;
  }
`;
const ButtonWrapper = styled.div`
  ${tw`w-full flex justify-center`};
  > button + button {
    margin-left: 10px;
  }
`;
export { MaxWidthWrapper, TextWrapper, ButtonWrapper };
