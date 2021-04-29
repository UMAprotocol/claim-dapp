import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import {
  Section,
  AccentSection,
  About,
  MainSection,
  Navbar,
  Footer,
  NetworkAlert,
} from "./components";
import { ConnectionProvider, OptionsProvider } from "./hooks";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConnectionProvider>
        <NetworkAlert />
        <OptionsProvider>
          <Navbar />
          <main>
            <MainSection />
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
