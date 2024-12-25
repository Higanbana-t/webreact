import React, { useState, useEffect, useRef } from 'react';
import { fetchPlaylists } from '../services/api'; 
import { GrPrevious, GrNext } from 'react-icons/gr'; // Import các icon GrPrevious và GrNext
import './DefaultRecommendations.css';
import { IoMdPlay } from 'react-icons/io'; // Import icon play

const DefaultRecommendations = ({ onPlayPlaylist }) => {
    const [playlists, setPlaylists] = useState([]);  // State lưu playlists
    const [loading, setLoading] = useState(true);    // State để xử lý trạng thái loading
    const [error, setError] = useState(null);        // State để lưu lỗi
    const [showScrollLeft, setShowScrollLeft] = useState(false);  // State điều khiển nút cuộn trái
    const [showScrollRight, setShowScrollRight] = useState(true);  // State điều khiển nút cuộn phải
    const [currentPlaylist, setCurrentPlaylist] = useState(null);
    const playlistContainerRef = useRef(null);       // Ref để tham chiếu tới container playlist

    useEffect(() => {
      const loadPlaylists = async () => {
        try {
          const data = await fetchPlaylists(); // Lấy dữ liệu từ API
          setPlaylists(data.playlists);         // Lưu vào state playlists
          setLoading(false);                    // Đặt loading là false sau khi nhận được dữ liệu
        } catch (err) {
          setError(err.message || 'Có lỗi xảy ra');  // Nếu có lỗi, lưu lỗi vào state
          setLoading(false);                        // Đặt loading là false
        }
      };
  
      loadPlaylists();  // Gọi API để lấy playlists
    }, []);  // useEffect chạy 1 lần khi component được mount
  
    const scrollLeft = () => {
      if (playlistContainerRef.current) {
        playlistContainerRef.current.scrollBy({ left: -870, behavior: 'smooth' });
      }
    };

    const scrollRight = () => {
      if (playlistContainerRef.current) {
        playlistContainerRef.current.scrollBy({ left: 870, behavior: 'smooth' });
      }
    };

    // Kiểm tra xem đã cuộn đến đầu hay cuối chưa
    const checkScrollPosition = () => {
      if (playlistContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = playlistContainerRef.current;
        
        // Hiển thị nút cuộn trái khi không ở đầu
        setShowScrollLeft(scrollLeft > 0);

        // Hiển thị nút cuộn phải khi không ở cuối
        setShowScrollRight(scrollLeft < scrollWidth - clientWidth);
      }
    };

    useEffect(() => {
      // Kiểm tra vị trí cuộn khi component được mount hoặc khi cuộn
      checkScrollPosition();
      const container = playlistContainerRef.current;
      if (container) {
        container.addEventListener('scroll', checkScrollPosition); // Thêm sự kiện cuộn
      }

      return () => {
        if (container) {
          container.removeEventListener('scroll', checkScrollPosition); // Dọn dẹp sự kiện cuộn khi component unmount
        }
      };
    }, [playlists]);

    if (loading) {
      return <div>Đang tải danh sách playlists...</div>; // Hiển thị thông báo khi đang tải
    }
  
    if (error) {
      return <div>Lỗi: {error}</div>; // Hiển thị lỗi nếu có
    }
    const handlePlayPlaylist = (playlist) => {
      onPlayPlaylist(playlist);  // Gọi callback từ cha khi bấm play
  };

    return (
        <div className='trendingmusic'>
            <div className='trendingmusic-title'>
                <h2 className='mixedSelectionModule__titleText'>Trending Music SoundCloud</h2>
            </div>
            
            {/* Phần hiển thị các playlist */}
            <div className='trendingmusic-content'>
                {playlists.length === 0 ? (
                    <div>Không có playlists nào.</div>
                ) : (
                    <div className="playlist-container" ref={playlistContainerRef}>
                        {playlists.map((playlist, index) => (
                            <div
                                key={playlist.playlist.id}
                                data-tile-index={index}
                                className="playlist-item"
                            >
                                {/* Ảnh bìa là bài hát đầu tiên trong playlist */}
                                <div className="playlist-image">
                                    <img
                                        src={playlist.songs[0]?.cover_url} 
                                        alt={playlist.songs[0]?.name}
                                    />
                                    <button
                                        className="play-button"
                                        onClick={() =>  handlePlayPlaylist(playlist)}
                                    >
                                        <IoMdPlay />
                                    </button>
                                </div>
                                <div className="playlist-info">
                                    {/* Tiêu đề playlist */}
                                    <h2 className='nameplaylist'>{playlist.songs[0]?.genre}</h2>
                                    <p>Trendingmusic</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Nút cuộn trái và phải */}
                <div className="scroll-buttons">
                    <button 
                        onClick={scrollLeft} 
                        className={`scroll-left ${!showScrollLeft ? 'hidden' : ''}`}
                    >
                        <GrPrevious /> {/* Thay thế nút cuộn trái bằng icon GrPrevious */}
                    </button>
                    <button 
                        onClick={scrollRight} 
                        className={`scroll-right ${!showScrollRight ? 'hidden' : ''}`}
                    >
                        <GrNext /> {/* Thay thế nút cuộn phải bằng icon GrNext */}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DefaultRecommendations;
