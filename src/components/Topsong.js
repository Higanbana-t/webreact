import React, { useState, useEffect, useRef } from 'react';
import { fetchTopSongs } from '../services/api'; // Import API lấy dữ liệu bài hát
import { GrPrevious, GrNext } from 'react-icons/gr'; // Import các icon cuộn
import './TopSong.css'; // CSS cho giao diện
import { IoMdPlay } from 'react-icons/io'; // Import icon play
import MusicPlayer from './MusicPlayer'; // Import MusicPlayer component

const TopSong = ({ onPlaySong }) => {
    const [songs, setSongs] = useState([]);  // State lưu bài hát
    const [loading, setLoading] = useState(true);    // State để xử lý trạng thái loading
    const [error, setError] = useState(null);        // State để lưu lỗi
    const [showScrollLeft, setShowScrollLeft] = useState(false);  // Điều khiển nút cuộn trái
    const [showScrollRight, setShowScrollRight] = useState(true);  // Điều khiển nút cuộn phải

    const songContainerRef = useRef(null);       // Ref để tham chiếu tới container bài hát
    const [currentSong, setCurrentSong] = useState(null);

    useEffect(() => {
        const loadSongs = async () => {
            try {
                const data = await fetchTopSongs(); // Lấy dữ liệu từ API
                setSongs(data.songs);               // Lưu vào state songs
                setLoading(false);                  // Đặt loading là false khi nhận được dữ liệu
            } catch (err) {
                setError(err.message || 'Có lỗi xảy ra');  // Nếu có lỗi, lưu lỗi vào state
                setLoading(false);                      // Đặt loading là false
            }
        };

        loadSongs();  // Gọi API để lấy bài hát
    }, []);  // useEffect chạy 1 lần khi component được mount

    const scrollLeft = () => {
        if (songContainerRef.current) {
            songContainerRef.current.scrollBy({ left: -870, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (songContainerRef.current) {
            songContainerRef.current.scrollBy({ left: 870, behavior: 'smooth' });
        }
    };

    // Kiểm tra vị trí cuộn
    const checkScrollPosition = () => {
        if (songContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = songContainerRef.current;

            // Hiển thị nút cuộn trái khi không ở đầu
            setShowScrollLeft(scrollLeft > 0);

            // Hiển thị nút cuộn phải khi không ở cuối
            setShowScrollRight(scrollLeft < scrollWidth - clientWidth);
        }
    };

    useEffect(() => {
        // Kiểm tra vị trí cuộn khi component được mount hoặc khi cuộn
        checkScrollPosition();
        const container = songContainerRef.current;
        if (container) {
            container.addEventListener('scroll', checkScrollPosition); // Thêm sự kiện cuộn
        }

        return () => {
            if (container) {
                container.removeEventListener('scroll', checkScrollPosition); // Dọn dẹp sự kiện cuộn khi component unmount
            }
        };
    }, [songs]);

    if (loading) {
        return <div>Đang tải danh sách bài hát...</div>; // Hiển thị thông báo khi đang tải
    }

    if (error) {
        return <div>Lỗi: {error}</div>; // Hiển thị lỗi nếu có
    }
    const handlePlaySong = (song) => {
        setCurrentSong(song);  // Cập nhật bài hát hiện tại
        onPlaySong(song);  // Gọi callback từ cha khi bấm play
    };


    return (
        <div className='topsong'>
            <div className='topsong-title'>
                <h2 className='mixedSelectionModule__titleText'>Top Trending Songs</h2>
            </div>
            
            {/* Phần hiển thị các bài hát */}
            <div className='topsong-content'>
                {songs.length === 0 ? (
                    <div>Không có bài hát nào.</div>
                ) : (
                    <div className="song-container" ref={songContainerRef}>
                        {songs.map((song, index) => (
                            <div
                                key={song.id}
                                data-tile-index={index}
                                className="song-item"
                            >
                                {/* Ảnh bìa bài hát */}
                                <div className="song-image">
                                    <img
                                        src={song.cover_url} 
                                        alt={song.name}
                                    />
                                    <button
                                        className="play-button"
                                        onClick={() => handlePlaySong(song)}
                                    >
                                        <IoMdPlay />
                                    </button>
                                </div>
                                <div className="song-info">
                                    {/* Tiêu đề bài hát */}
                                    <h2 className='song-name'>{song.name}</h2>
                                    <p>{song.user_id}</p>
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

export default TopSong;
