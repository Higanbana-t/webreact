import React, { useState, useEffect } from 'react';
import './AddSongToPlaylist.css';  // Tạo file css để quản lý màu sắc và layout

const AddSongToPlaylist = ({ songId, closeModal }) => {
  const [selectedOption, setSelectedOption] = useState('add');  // Quản lý lựa chọn

  // Xử lý khi người dùng chọn "Add to Playlist" hoặc "Create Playlist"
  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const handleAddSongToPlaylist = () => {
    // Thực hiện logic thêm bài hát vào playlist
    console.log(`Thêm bài hát ${songId} vào playlist`);
    closeModal();  // Đóng modal sau khi thêm bài hát
  };

  const handleCreatePlaylist = () => {
    // Thực hiện logic tạo playlist mới
    console.log(`Tạo playlist mới và thêm bài hát ${songId}`);
    closeModal();  // Đóng modal sau khi tạo playlist
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Chọn hành động</h2>
        
        {/* Các nút lựa chọn */}
        <div className="button-group">
          <button
            className={`option-button ${selectedOption === 'add' ? 'selected' : ''}`}
            onClick={() => handleOptionChange('add')}
          >
            Add to Playlist
          </button>
          <button
            className={`option-button ${selectedOption === 'create' ? 'selected' : ''}`}
            onClick={() => handleOptionChange('create')}
          >
            Create Playlist
          </button>
        </div>

        {/* Hiển thị các nội dung tương ứng với lựa chọn */}
        {selectedOption === 'add' && (
          <div>
            <h3>Chọn Playlist</h3>
            {/* Thêm logic chọn playlist ở đây */}
          </div>
        )}
        
        {selectedOption === 'create' && (
          <div>
            <h3>Tạo Playlist mới</h3>
            {/* Thêm form tạo playlist mới ở đây */}
          </div>
        )}

        {/* Nút đóng */}
        <button onClick={closeModal} className="close-button">Đóng</button>
      </div>
    </div>
  );
};

export default AddSongToPlaylist;
