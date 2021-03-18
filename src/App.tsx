import React from "react";
import {
  Section,
  AccentSection,
  About,
  Hero,
  Navbar,
  Footer,
  Options,
} from "./components";
import { ConnectionProvider, ClaimProvider } from "./hooks";

function App() {
  return (
    <ConnectionProvider>
      <ClaimProvider>
        <Navbar />
        <main>
          <AccentSection>
            <Hero />
          </AccentSection>
          <Section>
            <Options />
          </Section>
          <AccentSection>
            <About />
          </AccentSection>
          <Section>
            <Footer />
          </Section>
        </main>
      </ClaimProvider>
    </ConnectionProvider>
  );
}

export default App;
