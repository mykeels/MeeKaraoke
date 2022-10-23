import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";

import { App } from "./App";

export default {
  title: "App",
  component: App,
  decorators: []
};

const queryClient = new QueryClient();

export const Index = () => (
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
