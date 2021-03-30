import React from "react";
import tw from "twin.macro";
import { MaxWidthWrapper } from "./Wrappers";
import KPIOptions from "./KPIOptions";
import OptionsList from "./OptionsList";

const Options: React.FC = () => {
  return (
    <MaxWidthWrapper>
      <Wrapper>
        <KPIOptions />
        <OptionsList />
      </Wrapper>
    </MaxWidthWrapper>
  );
};
export default Options;

const Wrapper = tw.div`
    px-10 py-20 grid grid-cols-1 md:grid-cols-2 gap-10
`;
