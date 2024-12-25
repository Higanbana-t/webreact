import React, { useState, useEffect } from 'react';
import './Header.css';
import logo from '../img/1.jpg';
import { CaretDownOutlined } from '@ant-design/icons';
import { IoSearch } from "react-icons/io5";
import { Popover } from 'antd';  // Thêm dòng này

import UploadSong from './UploadSong'; // Import component UploadSong
import LoginForm from './LoginForm'; // Import LoginForm
import RegisterForm from './RegisterForm'; // Import RegisterForm

const Header = ({ onMenuItemClick, onLoginClick, onRegisterClick, onSearch}) => {
  const [activeItem, setActiveItem] = useState('Home'); // Trạng thái lưu menu đang được chọn
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // Lưu giá trị tìm kiếm
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Trạng thái đăng nhập
  const [showUpload, setShowUpload] = useState(false); // Trạng thái hiển thị form UploadSong
  const [userId, setUserId] = useState(null); // Lưu ID người dùng
  const [showLogin, setShowLogin] = useState(false); // Trạng thái hiển thị LoginForm
  const [showRegister, setShowRegister] = useState(false); // Trạng thái hiển thị RegisterForm

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const storedUserId = localStorage.getItem('userId');
      setIsLoggedIn(true);
      setUserId(storedUserId);
      
      
    }
  }, []);

  const handleMenuItemClick = (menuItem) => {
    setActiveItem(menuItem); // Cập nhật menu item đang chọn
    onMenuItemClick(menuItem); // Gọi hàm trên prop để thay đổi nội dung
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    setUserId(null);
    
    alert('Bạn đã đăng xuất!');
  };
  const hidePopover = () => {
    setOpen(false); // Đóng popover
  };

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen); // Cập nhật trạng thái mở popover
  };

  // Hàm xử lý tìm kiếm khi nhấn nút tìm kiếm
  const handleSearchClick = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery); // Gọi hàm onSearch từ prop khi nhấn tìm kiếm
    }
  };

  return (
    <header>
      <div className='logo'>
        <img src={logo} alt='logo' />
      </div>
      <nav className='menu'>
        <ul className='menuList'>
          <li
            className={`menuItem ${activeItem === 'Home' ? 'active' : ''}`}
            onClick={() => handleMenuItemClick('Home')}
          >
            Home
          </li>
          <li
            className={`menuItem ${activeItem === 'Feed' ? 'active' : ''}`}
            onClick={() => handleMenuItemClick('Feed')}
          >
            Feed
          </li>
          <li
            className={`menuItem ${activeItem === 'Library' ? 'active' : ''}`}
            onClick={() => handleMenuItemClick('Library')}
          >
            Library
          </li>
        </ul>
      </nav>
      <div className='search'>
        <input 
          type="text" 
          placeholder="Tìm kiếm..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} // Lắng nghe thay đổi giá trị
        />
        
        <button className="search-icon" onClick={handleSearchClick}>
          <IoSearch />
        </button>{/* Khi bấm vào icon tìm kiếm */}
      </div>

      {isLoggedIn ? (
        <>
          <button className="uploadButton" onClick={() => setShowUpload(true)}>
            Upload File
          </button>
          <Popover
            content={<button className="logoutButton" onClick={handleLogout}>Sign out</button>}
            trigger="click"
            open={open}
            onOpenChange={handleOpenChange}
            >
            <img src={logo} alt='logo' className="moreOptionsIcon" />
            <CaretDownOutlined />
          </Popover>
        </>
      ) : (
        <>
          <button className="loginButton" onClick={onLoginClick}>
            Sign in
          </button>
          <button className="signupButton" onClick={onRegisterClick}>
            Create account
          </button>
        </>
      )}
    </header>
  );
};

export default Header;
