import { NavLink } from 'react-router-dom';

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="profile">
        <div className="profile-image"></div>
        <span>프로필</span>
      </div>

      <nav className="sidebar-menu">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? 'menu-item active' : 'menu-item'
          }
        >
          대시보드
        </NavLink>

        <NavLink
          to="/meetings"
          className={({ isActive }) =>
            isActive ? 'menu-item active' : 'menu-item'
          }
        >
          회의
        </NavLink>

        <NavLink
          to="/tasks"
          end
          className={({ isActive }) =>
            isActive ? 'menu-item active' : 'menu-item'
          }
        >
          MY 업무
        </NavLink>
      </nav>

      <div className="sidebar-bottom">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            isActive ? 'menu-item settings-item active' : 'menu-item settings-item'
          }
        >
          <svg
            className="settings-icon"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <path
              d="M19.4 13.6a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V19.5a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H4.5a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1.08 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H10a1.65 1.65 0 0 0 1-1.51V4.5a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V10a1.65 1.65 0 0 0 1.51 1H19.5a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
              stroke="currentColor"
              strokeWidth="1.6"
            />
          </svg>
          설정
        </NavLink>
      </div>
    </aside>
  );
}

export default Sidebar;