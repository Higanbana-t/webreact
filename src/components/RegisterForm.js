import React, { useState } from 'react';
import { registerUser } from '../services/api';
import './RegisterForm.css';
  // Tạo file css để quản lý màu sắc và layout
const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user', // Thêm trường role mặc định là user
    name: '', // Tên nghệ sĩ, chỉ sử dụng khi role là artist
    bio: '',  // Tiểu sử nghệ sĩ, chỉ sử dụng khi role là artist
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Kiểm tra mật khẩu nhập lại
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu và mật khẩu xác nhận không khớp.');
      return;
    }

    // Kiểm tra thông tin nghệ sĩ nếu chọn role là artist
    if (formData.role === 'artist' && (!formData.name || !formData.bio)) {
      setError('Vui lòng điền đầy đủ thông tin nghệ sĩ.');
      return;
    }

    try {
      const response = await registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        name: formData.name,  // Nếu role là artist, truyền name
        bio: formData.bio,    // Nếu role là artist, truyền bio
      });
      setSuccess(response.message);
      setFormData({ username: '', email: '', password: '', confirmPassword: '', role: 'user', name: '', bio: '' }); // Reset form
    } catch (err) {
      setError(err.message || 'Đăng ký thất bại.');
    }
  };

  return (
    <div className='register-form'>
      <h2>Đăng ký tài khoản</h2>
      <form onSubmit={handleSubmit}>
        <div>
          
          <input
            placeholder="Tên người dùng"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          
          <input
            placeholder="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          
          <input
            placeholder="Mật khẩu"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          
          <input
            placeholder="Nhập lại mật khẩu"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        {/* Thêm phần chọn role */}
        <div>
          <label>Chọn vai trò:</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="user">Người dùng</option>
            <option value="artist">Nghệ sĩ</option>
          </select>
        </div>

        {/* Nếu chọn role là artist, hiển thị thêm thông tin nghệ sĩ */}
        {formData.role === 'artist' && (
          <>
            <div>
              <label>Tên nghệ sĩ:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Tiểu sử nghệ sĩ:</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                required
              />
            </div>
          </>
        )}

        <button type="submit">Đăng ký</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
};

export default RegisterForm;

