import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { CategoriesPage } from './pages/CategoriesPage';
import { ItemDefinitionsPage } from './pages/ItemDefinitionsPage';
import { InventoriesPage } from './pages/InventoriesPage';
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
        <div className="app">
          <nav className="sidebar">
            <div className="sidebar-header">
              <h2>Inventoria</h2>
            </div>
            <ul className="nav-links">
              <li>
                <Link to="/">Dashboard</Link>
              </li>
              <li>
                <Link to="/categories">Categories</Link>
              </li>
              <li>
                <Link to="/item-definitions">Item Definitions</Link>
              </li>
              <li>
                <Link to="/inventories">Inventories</Link>
              </li>
              <li>
                <Link to="/inventory-items">Inventory Items</Link>
              </li>
            </ul>
          </nav>

          <main className="main-content">
            <Routes>
              <Route path="/" element={<Navigate to="/item-definitions" replace />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/item-definitions" element={<ItemDefinitionsPage />} />
              <Route path="/inventories" element={<InventoriesPage />} />
              <Route path="/inventory-items" element={<div>Inventory Items - Coming Soon</div>} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
