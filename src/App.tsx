import React from "react";
import { ConnectionProvider } from "./hooks";
import { Navbar } from "./components";

function App() {
  return (
    <ConnectionProvider>
      <Navbar />
    </ConnectionProvider>
  );
}

export default App;
