import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';

const Login = ({onLoginSuccess }) => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ ma: '', matkhau: '' });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();

      // Lưu token vào localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      
      // Gọi hàm onLoginSuccess từ props để thông báo đăng nhập thành công
      onLoginSuccess();

      // Điều hướng đến trang /nhanvien sau khi đăng nhập thành công
      navigate('/nhanvien');
      
      toast.success('Đăng nhập thành công');   
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="ma">Username:</label>
          <input type="text" id="ma" name="ma" value={credentials.ma} onChange={handleChange} className="form-control" />
        </div>
        <div className="form-group">
          <label htmlFor="matkhau">Password:</label>
          <input type="password" id="matkhau" name="matkhau" value={credentials.matkhau} onChange={handleChange} className="form-control" />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </div>
  );
};

export default Login;
