// src/components/Playlist.js
import React, { useState, useEffect } from 'react';
import { fetchPlaylists } from '../services/api'; // Import hàm fetchPlaylists từ api.js

const Playlist = ({ onDataFetched }) => {
  const [playlistsData, setPlaylistsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getPlaylists = async () => {
      try {
        const data = await fetchPlaylists(); // Gọi API để lấy dữ liệu playlists
        console.log('Dữ liệu playlists:', data); // Debugging
        setPlaylistsData(data); // Cập nhật playlistsData với dữ liệu nhận được
        if (onDataFetched) onDataFetched(data); // Trả dữ liệu ra ngoài nếu onDataFetched được truyền vào
      } catch (err) {
        setError(err.message); // Lưu lỗi nếu có
      } finally {
        setLoading(false); // Đổi trạng thái loading thành false
      }
    };

    getPlaylists();
  }, [onDataFetched]); // Chạy 1 lần khi component Playlist được mount

  if (loading) {
    return <div>Loading playlists...</div>;
  }

  if (error) {
    return <div>{`Lỗi: ${error}`}</div>;
  }

  return (
    <div className="playlist-container">

    </div>
  );
};

export default Playlist;
