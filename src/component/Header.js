
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ isLoggedIn, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Thực hiện xóa token và điều hướng về trang đăng nhập
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    onLogout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link className="navbar-brand" to="/nhanvien">Quản lý Nhân Viên</Link>
      <Link className="navbar-brand" to="/duan">Danh sách Dự án</Link>
      {isLoggedIn ? (
        <Link onClick={handleLogout}className="navbar-brand">Logout</Link>
      ) : (
        <Link className="navbar-brand" to="/">Login</Link>
      )}
    </nav>
  );
};

export default Header;