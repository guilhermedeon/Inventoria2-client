import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { logout, user } = useAuth();
  const location = useLocation();

  const getLinkClass = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`) ? 'active' : '';
  };

  return (
    <div className="app">
      <nav className="sidebar">
        <div className="sidebar-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img src="/logo.svg" alt="Inventoria Logo" style={{ width: '40px', height: '40px' }} />
          <h2>Inventoria</h2>
        </div>
        
        {user && (
          <div className="user-info" style={{ padding: '0 2rem 1rem 2rem' }}>
            Welcome back,
            <span>{user.firstName} {user.lastName}</span>
          </div>
        )}

        <ul className="nav-links">
          <li>
            <Link to="/categories" className={getLinkClass('/categories')}>Categories</Link>
          </li>
          <li>
            <Link to="/tags" className={getLinkClass('/tags')}>Tags</Link>
          </li>
          <li>
            <Link to="/item-definitions" className={getLinkClass('/item-definitions')}>Item Definitions</Link>
          </li>
          <li>
            <Link to="/pack-definitions" className={getLinkClass('/pack-definitions')}>Pack Definitions</Link>
          </li>
          <li>
            <Link to="/inventories" className={getLinkClass('/inventories')}>Inventories</Link>
          </li>
        </ul>
        <div className="sidebar-footer">
          <button onClick={logout} className="btn-secondary btn-full">
            Logout
          </button>
        </div>
      </nav>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

