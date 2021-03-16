import tw, { styled } from "twin.macro";

const Section = styled.section`
  ${tw`w-full bg-black text-white`}
`;

const AccentSection = styled.section`
  ${tw`w-full bg-secondary text-black`}
`;

export { Section, AccentSection };
