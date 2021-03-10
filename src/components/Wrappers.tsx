import tw, { styled } from "twin.macro";

const MaxWidthWrapper = tw.div`w-full max-w-screen-xl mx-auto`;
const TextWrapper = styled.div`
  ${tw`text-left w-full max-w-prose text-lg leading-relaxed mx-auto`}
  > p + p {
    margin-top: 1em;
  }
`;
export { MaxWidthWrapper, TextWrapper };
