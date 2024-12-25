import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // URL của back-end

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data; // Trả về lỗi từ API
    } else {
      throw new Error('Lỗi kết nối với máy chủ.');
    }
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    console.error('Error during login:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Đăng nhập thất bại!' };
  }
};

export const fetchPlaylists = async () => {
  try {
    const response = await axios.post(`${API_URL}/create-playlists`); 
    return response.data; // Giả định API trả về danh sách playlists
  } catch (error) {
    console.error('Error fetching playlists:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Không thể tải danh sách playlists!' };
  }
};
export const fetchTopSongs = async () => {
  try {
    const response = await axios.get(`${API_URL}/songs/top-20-songs`);
    return response.data;  // Assuming API returns top songs
  } catch (error) {
    console.error('Error fetching top songs:', error.response?.data || error.message);
    // Return a custom error message
    throw error.response?.data || { message: 'Không thể tải danh sách bài hát phổ biến!' };
  }
};
export const saveListeningHistory = async (userId, songId) => {
  try {
    console.log(`Sending data to API: userId = ${userId}, songId = ${songId}`);
    const response = await axios.post(`${API_URL}/music/saveListeningHistory`, {
      userId: userId,
      songId: songId,
    });
    return response.data;
  } catch (error) {
    console.error('Error saving listening history:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Không thể lưu lịch sử nghe!' };
  }
  
};
export const getRandomSongs = async () => {
  try {
    const response = await axios.get(`${API_URL}/songs/random`);
    return response.data; // Giả sử API trả về danh sách bài hát ngẫu nhiên
  } catch (error) {
    console.error('Error fetching random songs:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Không thể tải danh sách bài hát ngẫu nhiên!' };
  }
};
