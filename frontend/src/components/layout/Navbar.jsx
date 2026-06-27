import { Link, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const NAV_LINKS = [
  { path: '/setup',     label: 'New Interview' },
  { path: '/analytics', label: 'Analytics'     },
  { path: '/history',   label: 'History'       },
];

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) return null;

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-base/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/setup" className="flex items-center gap-2.5 group">
            <div
              className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center
                         text-white font-bold text-sm shadow-accent
                         group-hover:shadow-accent transition-shadow duration-300"
            >
              IF
            </div>

            <span className="font-bold text-text-primary hidden sm:block">
              Interview<span className="text-accent">Forge</span>
            </span>
          </Link>

          <div className="flex items-center gap-1">
            {NAV_LINKS.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${
                    location.pathname === path
                      ? 'bg-accent/10 text-accent'
                      : 'text-text-muted hover:text-text-primary hover:bg-elevated'
                  }
                `}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div
              className="hidden sm:flex items-center gap-2.5
                         px-3 py-1.5 rounded-lg bg-elevated border border-border"
            >
              <div
                className="w-6 h-6 rounded-full bg-accent/20 border border-accent/30
                           flex items-center justify-center"
              >
                <span className="text-accent text-xs font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>

              <span className="text-sm text-text-primary font-medium">
                {user?.name}
              </span>
            </div>

            <button
              onClick={logout}
              className="px-3 py-1.5 rounded-lg text-sm text-text-muted
                         hover:text-danger hover:bg-danger/10 border border-transparent
                         hover:border-danger/20 transition-all duration-200"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;