import React from "react";
import tw from "twin.macro";
import Portal from "./Portal";

const Alert = () => (
  <Portal>
    <BgBlur />
    <Aside>
      🚨 This Dapp will only work on Mainnet and Kovan. Please change your
      network and reload the page.
    </Aside>
  </Portal>
);

const Aside = tw.aside`
    text-center text-white text-xl font-semibold p-8 fixed top-0 left-0 right-0 bg-black border-primary
`;
const BgBlur = tw.div`
  fixed inset-0 bg-black bg-opacity-50
`;
export default Alert;
