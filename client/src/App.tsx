import "./App.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router";

import { MainLayout } from "./core/layouts/MainLayout";
import { NotFoundView } from "./core/views/NotFoundView";
import { StaysListView } from "./modules/stays/views/StaysListView";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<StaysListView />} />

            <Route
              path="/stays/:id"
              element={<div>Stay Details (Coming Soon)</div>}
            />
            <Route
              path="/checkout"
              element={<div>Checkout (Coming Soon)</div>}
            />

            <Route path="*" element={<NotFoundView />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};
