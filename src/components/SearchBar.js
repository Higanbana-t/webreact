import React, { useState } from 'react';
import { searchAPI } from '../services/api'; // Import hàm API từ file đã tạo

const SearchComponent = () => {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('everything');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await searchAPI(query, type); // Gọi hàm searchAPI
      setResults(data); // Cập nhật kết quả
    } catch (err) {
      setError('Có lỗi xảy ra, vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-container">
      <h1>Tìm Kiếm</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Nhập từ khóa tìm kiếm..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="everything">Tất cả</option>
          <option value="song">Bài hát</option>
          <option value="album">Album</option>
          <option value="people">Người dùng</option>
          <option value="playlists">Playlist</option>
        </select>
        <button onClick={handleSearch} disabled={loading}>
          {loading ? 'Đang tìm...' : 'Tìm kiếm'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="search-results">
        {results.length === 0 && !loading && <p>Không tìm thấy kết quả.</p>}
        {results.length > 0 && (
          <ul>
            {results.songs &&
              results.songs.map((song) => (
                <li key={song.id}>
                  <p>
                    <strong>Bài hát:</strong> {song.name} ({song.genre})
                  </p>
                </li>
              ))}
            {results.albums &&
              results.albums.map((album) => (
                <li key={album.id}>
                  <p>
                    <strong>Album:</strong> {album.title}
                  </p>
                </li>
              ))}
            {results.users &&
              results.users.map((user) => (
                <li key={user.id}>
                  <p>
                    <strong>Người dùng:</strong> {user.username}
                  </p>
                </li>
              ))}
            {results.playlists &&
              results.playlists.map((playlist) => (
                <li key={playlist.id}>
                  <p>
                    <strong>Playlist:</strong> {playlist.name}
                  </p>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchComponent;
