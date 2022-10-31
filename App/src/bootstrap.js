import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, MemoryRouter, BrowserRouter } from "react-router-dom";

import { App } from "./App";
import { QueryClient, QueryClientProvider } from "react-query";
import { useBaseHref } from "./hooks";

const queryClient = new QueryClient();
const Router = process.env.REACT_APP_USE_HASH_ROUTER
  ? HashRouter
  : typeof window === "undefined"
  ? MemoryRouter
  : BrowserRouter;

const baseHref = useBaseHref();
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router basename={baseHref}>
        <App />
      </Router>
    </QueryClientProvider>
  </React.StrictMode>
);
