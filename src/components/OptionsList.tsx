import React from "react";
import tw, { styled } from "twin.macro";
import Heading from "./Heading";
import Button from "./Button";
import Link from "./Link";

const options = Array(6).fill({
  name: "Project",
  description:
    "The uGas token being managed by the YAM team in collaberation with UMA. Build for Degens.",
  imgUrl: "",
  mintLink: "https://github.com/",
});
const OptionsList: React.FC = () => {
  const [expanded, setExpanded] = React.useState(false);
  const optionsToShow = options.slice(0, expanded ? options.length : 4);
  return (
    <Wrapper>
      <MainHeading level={3}>Help UMA level up</MainHeading>
      <About>
        The more you mint, the more UMA’s TVL will grow. Below is a list of
        projects that lorem ipsum dolor sit amet.
      </About>
      <List>
        {optionsToShow.map((option) => (
          <li key={option.name}>
            <OptionWrapper>
              <Content>
                <OptionAvatar />
                <OptionText>
                  <Heading level={6}>{option.name}</Heading>
                  <Description>{option.description}</Description>
                </OptionText>
              </Content>
              <Link
                href={option.mintLink}
                rel="noopener norefferrer"
                target="_blank"
              >
                <MintButton variant="secondary">Mint</MintButton>
              </Link>
            </OptionWrapper>
          </li>
        ))}
      </List>
      <SeeAllButton
        variant="secondary"
        onClick={() => {
          setExpanded(!expanded);
        }}
      >
        {expanded ? "See Less" : "See All Projects"}
      </SeeAllButton>
    </Wrapper>
  );
};

export default OptionsList;
const Wrapper = tw.div`flex flex-col `;
const MainHeading = styled(Heading)`
  font-size: 2rem;
  ${tw`text-center mb-5`}
`;
const About = tw.p`text-xl`;
const List = tw.ul`flex flex-col divide-y divide-gray`;
const OptionWrapper = styled.div`
  ${tw`pb-5 flex justify-between`};
  padding-top: 30px;
`;
const Content = tw.div`flex`;
const OptionText = tw.div`flex flex-col`;
const OptionAvatar = tw.div`mr-5 bg-primary w-14 h-14 rounded-full`;
const Description = styled.p`
  ${tw`mt-3 text-lg`};
  max-width: 380px;
`;
const MintButton = styled(Button)`
  padding: 6px 30px;
`;
const SeeAllButton = styled(Button)`
  padding: 15px 46px;
  margin: auto;
`;
