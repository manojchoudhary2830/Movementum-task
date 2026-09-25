import { useAuth } from '../context/AuthContext';

export default function Header({ onAddClick }) {
  const { user, signOut } = useAuth();
  return (
    <header className="header">
      <div className="container header-inner">
        <h1 className="logo">Momentum</h1>
        <div className="header-actions">
          <span className="user-email" title={user?.email}>
            {user?.email}
          </span>
          <button className="btn btn-primary" onClick={onAddClick} type="button">
            + New Task
          </button>
          <button className="btn" onClick={signOut} type="button">
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}