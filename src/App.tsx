import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import {
  Section,
  AccentSection,
  About,
  Hero,
  Navbar,
  Footer,
  Options,
} from "./components";
import { ConnectionProvider, OptionsProvider } from "./hooks";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConnectionProvider>
        <OptionsProvider>
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
        </OptionsProvider>
      </ConnectionProvider>
    </QueryClientProvider>
  );
}

export default App;
