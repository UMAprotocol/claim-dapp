import React from "react";
import tw from "twin.macro";

type HeadingProps = {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
};
const Heading: React.FC<HeadingProps> = ({
  children,
  level = 1,
  ...delegated
}) => {
  const tag = `h${level}`;
  return (
    <Wrapper as={tag} {...delegated}>
      {children}
    </Wrapper>
  );
};
export default Heading;

const Wrapper = tw.h2`
    font-semibold
`;
