  import React, { useState, useEffect } from 'react';
  import { loginUser } from '../services/api';
  import './LoginForm.css';

  const LoginForm = ({ onLoginStateChange }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
        setIsLoggedIn(true); // Nếu có token, coi như đã đăng nhập
      }
    }, []);

    const handleLogout = () => {
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      setMessage('Bạn đã đăng xuất thành công!');
      onLoginStateChange(false, null); // Cập nhật trạng thái đăng xuất
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      try {
        const data = await loginUser(email, password);
        setMessage(data.message);
        localStorage.setItem('token', data.token); // Lưu token
        setIsLoggedIn(true);
        onLoginStateChange(true, data.user.id); // Cập nhật trạng thái đăng nhập
        console.log('data:', data);
        // Tải lại trang sau khi đăng nhập thành công
        window.location.reload();
      } catch (err) {
        setError(err.message || 'Có lỗi xảy ra.');
      }
    };

    return (
      <div className="login-form">
        {!isLoggedIn ? (
          <div>
            <h2>Đăng Nhập</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message && <p style={{ color: 'green' }}>{message}</p>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  placeholder="Mật khẩu"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit">Đăng Nhập</button>
            </form>
          </div>
        ) : (
          <div>
            <p>Chào mừng bạn đến với hệ thống!</p>
            <button onClick={handleLogout}>Đăng xuất</button>
          </div>
        )}
      </div>
    );
  };

  export default LoginForm;
