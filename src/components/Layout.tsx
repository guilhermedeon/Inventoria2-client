import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { logout } = useAuth();

  return (
    <div className="app">
      <nav className="sidebar">
        <div className="sidebar-header">
          <h2>Inventoria</h2>
        </div>
        <ul className="nav-links">
          <li>
            <Link to="/categories">Categories</Link>
          </li>
          <li>
            <Link to="/tags">Tags</Link>
          </li>
          <li>
            <Link to="/item-definitions">Item Definitions</Link>
          </li>
          <li>
            <Link to="/item-variants">Item Variants</Link>
          </li>
          <li>
            <Link to="/pack-definitions">Pack Definitions</Link>
          </li>
          <li>
            <Link to="/inventories">Inventories</Link>
          </li>
          <li>
            <Link to="/inventory-items">Inventory Items</Link>
          </li>
        </ul>
        <div className="sidebar-footer">
          <button onClick={logout} className="btn-secondary btn-full">
            Logout
          </button>
        </div>
      </nav>

      <main className="main-content">{children}</main>
    </div>
  );
};
