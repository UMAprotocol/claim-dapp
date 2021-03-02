import React from "react";
import { ConnectionProvider } from "./hooks";
import { Navbar, AccentSection, Hero } from "./components";

function App() {
  return (
    <ConnectionProvider>
      <AccentSection>
        <Hero />
      </AccentSection>
    </ConnectionProvider>
  );
}

export default App;
