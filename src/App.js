
import './App.scss';
import React, { useState, useEffect  } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './component/Header';
import TableNhanVien from './component/TableNhanVien';
import { ToastContainer } from 'react-toastify';
import DuAn from './componentDuAn/DuAn';
import Login from './component/Login';


function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Kiểm tra xem có token đăng nhập trong localStorage hay không
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []); // Chỉ chạy một lần sau khi component được render

  // Hàm xử lý đăng nhập thành công
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    // Điều hướng đến trang /nhanvien sau khi đăng nhập thành công
    return <Navigate to="/nhanvien" />;
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    // Xóa token khỏi localStorage khi đăng xuất
    localStorage.removeItem('token');
  };

  return (
    <div className="App">
      <BrowserRouter>
        {!isLoggedIn && <Login onLoginSuccess={handleLoginSuccess} />}
        {isLoggedIn && (
          <>
            <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
            <Routes>
              <Route path="/nhanvien" element={<TableNhanVien />} />
              <Route path='/duan' element={<DuAn/>}/>
            </Routes>
          </>
        )}
      </BrowserRouter>
      <ToastContainer />
    </div>
  );
}

export default App;
