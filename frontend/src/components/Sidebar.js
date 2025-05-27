import { Link } from "react-router-dom";
import "../styles/Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-title">メニュー</div>
      <ul className="sidebar-list">
        <li><Link to="/">マイページ</Link></li>
        <li><Link to="/calendar">カレンダー</Link></li>
        <li><Link to="/todo">To Do</Link></li>
        <li><Link to="/settings">設定</Link></li>
      </ul>
    </div>
  );
}

export default Sidebar;
