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
    </aside>
  );
}

export default Sidebar;