import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { registerRecognitionProxy } from "./utils";

import "./App.css";

const App: React.FC = () => {
  useEffect(() => {
    registerRecognitionProxy();
  }, []);

  return <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />;
};

export default App;
