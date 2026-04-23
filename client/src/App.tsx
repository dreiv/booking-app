import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes } from 'react-router'
import { MainLayout } from './core/layouts/MainLayout'
import { NotFoundView } from './core/views/NotFoundView'
import { CheckoutView } from './modules/bookings/views/CheckoutView'
import { MyBookingsView } from './modules/bookings/views/MyBookingsView'
import { FavoritesView } from './modules/favorites/views/FavoritesView'
import { StayDetailsView } from './modules/stays/views/StayDetailsView'
import { StaysView } from './modules/stays/views/StaysView'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
export const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<StaysView />} />
          <Route path="/stays/:id" element={<StayDetailsView />} />

          <Route path="/favorites" element={<FavoritesView />} />

          <Route path="/checkout/:stayId" element={<CheckoutView />} />
          <Route path="/bookings" element={<MyBookingsView />} />

          <Route path="*" element={<NotFoundView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
)
