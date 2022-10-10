import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";

import { TitleCreator } from "./";

export default {
  title: "components/TitleCreator",
  component: TitleCreator,
  decorators: []
};

const queryClient = new QueryClient();

export const Index = () => (
  <QueryClientProvider client={queryClient}>
    <TitleCreator />
  </QueryClientProvider>
);
