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
import { ConnectionProvider } from "./hooks";

function App() {
  return (
    <ConnectionProvider>
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
    </ConnectionProvider>
  );
}

export default App;
