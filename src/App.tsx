import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";

import "./App.css";

const App: React.FC = () => {
  return <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />;
};

export default App;
