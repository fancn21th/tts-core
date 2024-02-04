import { createBrowserRouter } from "react-router-dom";

import Home from "../pages/Home";
import App from "../pages/App";

const routes = [
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/app",
    Component: App,
  },
];

export const router = createBrowserRouter(routes);
