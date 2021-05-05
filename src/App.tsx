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
import { ConnectionProvider, TransactionsProvider } from "./hooks";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConnectionProvider>
        <NetworkAlert />
        <TransactionsProvider>
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
        </TransactionsProvider>
      </ConnectionProvider>
    </QueryClientProvider>
  );
}

export default App;
