import React, { useState, useEffect } from 'react';
import { IoClose } from "react-icons/io5"; // Import the IoClose icon
import Header from './components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import MusicPlayer from './components/MusicPlayer';
import Home from './components/Home';
import LoginForm from './components/LoginForm'; // Import LoginForm
import RegisterForm from './components/RegisterForm'; // Import RegisterForm
import axios from 'axios'; // Import axios để gọi API tìm kiếm
import TopSong from './components/Topsong';
import ListeningHistory from './components/ListeningHistory';

const App = () => {
  const [content, setContent] = useState('Home'); // Mặc định là 'Home'
  const [showLogin, setShowLogin] = useState(false); // Trạng thái hiển thị LoginForm
  const [showRegister, setShowRegister] = useState(false); // Trạng thái hiển thị RegisterForm
  const [searchQuery, setSearchQuery] = useState(''); // Lưu từ khóa tìm kiếm
  const [searchResults, setSearchResults] = useState([]); // Lưu kết quả tìm kiếm
  const [showSearchResults, setShowSearchResults] = useState(false); // Trạng thái hiển thị kết quả tìm kiếm
  const [currentSong, setCurrentSong] = useState(null); // State cho bài hát hiện tại
  const [currentPlaylist, setCurrentPlaylist] = useState(null); // State cho playlist hiện tại
  const [isLoggedIn, setIsLoggedIn] = useState(false);  // Trạng thái đăng nhập
  const [userId, setUserId] = useState(null);  // ID người dùng

  // Khôi phục trạng thái từ Local Storage khi tải lại trang
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');
    console.log('Token from Local Storage:', token);
    console.log('User ID from Local Storage:', storedUserId);
    if (token && storedUserId) {
      setIsLoggedIn(true);
      setUserId(parseInt(storedUserId, 10)); // Parse userId từ Local Storage
    }
  }, []);

  // Hàm cập nhật trạng thái đăng nhập và lưu vào Local Storage
  const handleLoginStateChange = (loggedIn, userId) => {
    console.log('Login State Changed:');
    console.log('Is Logged In:', loggedIn);
    console.log('User ID:', userId);
    setIsLoggedIn(loggedIn);
    setUserId(userId);

    if (loggedIn && userId) {
      localStorage.setItem('userId', userId); // Lưu userId vào Local Storage
      console.log('User ID saved to Local Storage:', userId)
    } else {
      localStorage.removeItem('userId'); // Xóa userId khỏi Local Storage khi đăng xuất
      localStorage.removeItem('token'); // Xóa token
      console.log('User ID and token removed from Local Storage');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);  // Cập nhật trạng thái đăng nhập khi có token
    }
  }, []);

  const handleMenuClick = (menuItem) => {
    setContent(menuItem); // Cập nhật nội dung khi chọn mục trong menu
  };

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      try {
        const response = await axios.get(`http://localhost:5000/api/search?query=${searchQuery}`);
        setSearchResults(response.data);
        setShowSearchResults(true);
        setContent('SearchResults');
      } catch (error) {
        console.error("Có lỗi khi tìm kiếm: ", error);
      }
    }
  };

  const renderSearchResults = () => (
    <div className="searchResults">
      <h2>Kết quả tìm kiếm</h2>
      {searchResults.length > 0 ? (
        searchResults.map((song) => (
          <div key={song.id} className="searchItem">
            <h3>{song.title}</h3>
            <p>{song.artist}</p>
          </div>
        ))
      ) : (
        <p>Không tìm thấy bài hát nào.</p>
      )}
    </div>
  );

  const renderContent = () => {
    switch(content) {
      case 'Home':
        return <Home onPlaySong={handlePlaySong} onPlayPlaylist={handlePlayPlaylist} />;
      case 'SearchResults':
        return renderSearchResults();
      default:
        return 'Please select a menu item.';
    }
  };

  const handleLoginClick = () => {
    setShowLogin(true);
    setShowRegister(false); // Đảm bảo chỉ hiển thị LoginForm
  };

  const handleRegisterClick = () => {
    setShowRegister(true);
    setShowLogin(false); // Đảm bảo chỉ hiển thị RegisterForm
  };
  const handlePlayPlaylist = (playlist) => {
    setCurrentPlaylist(playlist);  // Cập nhật playlist hiện tại
    console.log('Playing playlist:', playlist);
  };
  const handlePlaySong = (song) => {
    setCurrentSong(song);  // Cập nhật bài hát hiện tại
     // Gọi callback từ cha khi bấm play
};



  return (
    <div className='appContainer'>
      <Header 
        onMenuItemClick={handleMenuClick} 
        onLoginClick={handleLoginClick} 
        onRegisterClick={handleRegisterClick}
        onSearch={handleSearch}
        onLoginStateChange={handleLoginStateChange}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <div className="content">
        <div className='music recommendation'>
          {renderContent()}
        </div>
        <div className='sidebar'>
          <ListeningHistory />
        </div>
      </div>
      <MusicPlayer currentSong={currentSong} currentPlaylist={currentPlaylist} isLoggedIn={isLoggedIn} userId={userId} />
      
      {showLogin && (
        <div className="modal">
          <div>
            <LoginForm onLoginStateChange={handleLoginStateChange} />
            <button className="close-modal" onClick={() => setShowLogin(false)}>
              <IoClose />
            </button>
          </div>
        </div>
      )}

      {showRegister && (
        <div className="modal">
          <div>
            <RegisterForm />
            <button className="close-modal" onClick={() => setShowRegister(false)}>
              <IoClose />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
