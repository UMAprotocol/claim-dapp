import React from "react";
import tw from "twin.macro";
import Heading from "./Heading";

type ReasonProps = {
  reasons: string[];
};

const Reason: React.FC<ReasonProps> = ({ reasons }) => {
  return (
    <Wrapper>
      <Header level={6}>Your Options Breakdown:</Header>
      <List>
        {reasons.map((reason) => (
          <li key={reason}>{reason}</li>
        ))}
      </List>
    </Wrapper>
  );
};
export default Reason;

const Wrapper = tw.div`text-lg mt-4 mb-6`;
const Header = tw(Heading)`mb-3 text-gray font-normal`;
const List = tw.ol`list-inside list-disc pl-3`;
