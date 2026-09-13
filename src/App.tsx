import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { Layout } from './components/Layout';
import { CategoriesPage } from './pages/CategoriesPage';
import { TagsPage } from './pages/TagsPage';
import { ItemDefinitionsPage } from './pages/ItemDefinitionsPage';
import { ItemVariantsPage } from './pages/ItemVariantsPage';
import { PackDefinitionsPage } from './pages/PackDefinitionsPage';
import { InventoriesPage } from './pages/InventoriesPage';
import { InventoryItemsPage } from './pages/InventoryItemsPage';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected routes */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Navigate to="/item-definitions" replace />} />
                      <Route path="/categories" element={<CategoriesPage />} />
                      <Route path="/tags" element={<TagsPage />} />
                      <Route path="/item-definitions" element={<ItemDefinitionsPage />} />
                      <Route path="/item-variants" element={<ItemVariantsPage />} />
                      <Route path="/pack-definitions" element={<PackDefinitionsPage />} />
                      <Route path="/inventories" element={<InventoriesPage />} />
                      <Route path="/inventory-items" element={<InventoryItemsPage />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
