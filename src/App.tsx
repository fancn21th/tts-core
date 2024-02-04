import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { registerRecognition } from "./utils";

import "./App.css";

const App: React.FC = () => {
  useEffect(() => {
    registerRecognition();
  }, []);

  return <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />;
};

export default App;
