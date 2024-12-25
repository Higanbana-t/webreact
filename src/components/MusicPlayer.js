import React, { useState, useRef, useEffect } from 'react';
import './MusicPlayer.css';
import { IoIosPause, IoMdPlay, IoMdSkipForward, IoMdSkipBackward, IoIosShuffle } from 'react-icons/io';
import { RiRepeatLine } from 'react-icons/ri';
import { CiBoxList } from 'react-icons/ci'; // Import biểu tượng danh sách phát
import { saveListeningHistory } from '../services/api'; // Import hàm từ file API
import { getRandomSongs } from '../services/api';  // Import hàm lấy bài hát ngẫu nhiên từ API
import { IoVolumeMute, IoVolumeLowSharp, IoVolumeMedium } from 'react-icons/io5'; // Thêm các biểu tượng âm thanh

const MusicPlayer = ({ currentSong, currentPlaylist, isLoggedIn, userId, allSongs }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [songToPlay, setSongToPlay] = useState(null); // Trạng thái để lưu bài hát đang phát
  const [previousSong, setPreviousSong] = useState(null); // Lưu bài hát trước đó
  const [playlist, setPlaylist] = useState([]); // Playlist để phát
  const [showPlaylist, setShowPlaylist] = useState(false); // Trạng thái để điều khiển việc hiển thị danh sách phát
  const [isRepeating, setIsRepeating] = useState(false); // Trạng thái lặp lại bài hát
  const [volume, setVolume] = useState(1); // Trạng thái âm lượng
  const audioRef = useRef(null);

  useEffect(() => {
    if (currentSong) {
      loadRandomPlaylist(); // Kích hoạt tải playlist ngẫu nhiên
      setPlaylist(prevPlaylist => [currentSong, ...prevPlaylist.filter(s => s.id !== currentSong.id)]); // Thêm currentSong vào đầu playlist
      setSongToPlay(currentSong); // Cập nhật bài hát đang phát
      setIsPlaying(true); // Đảm bảo phát ngay
    } else if (currentPlaylist && currentPlaylist.songs && currentPlaylist.songs.length > 0) {
      setPlaylist(currentPlaylist.songs);  // Tạo playlist từ danh sách bài hát trong playlist
      setSongToPlay(currentPlaylist.songs[0]); // Lấy bài hát đầu tiên trong playlist để phát
      setIsPlaying(true); // Đảm bảo phát ngay
    }
  }, [currentSong, currentPlaylist]);

  const loadRandomPlaylist = async () => {
    try {
      const response = await getRandomSongs(); // Gọi API
      const randomSongs = response.songs; // Lấy mảng bài hát từ khóa 'songs'
      console.log(randomSongs); // Log để kiểm tra dữ liệu
  
      if (Array.isArray(randomSongs)) {
        setPlaylist([randomSongs[0], ...randomSongs.slice(1)]); // Đặt bài hát đầu tiên vào đầu playlist
        setSongToPlay(randomSongs[0]); // Đảm bảo bài hát đầu tiên được phát
        setIsPlaying(true); // Đảm bảo phát ngay
      } else {
        console.error('API response is not an array:', randomSongs);
      }
    } catch (error) {
      console.error('Error fetching random playlist:', error);
    }
  };

  useEffect(() => {
    if (audioRef.current && songToPlay) {
      audioRef.current.src = songToPlay.file_url;
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(error => console.error('Error playing song:', error));
    }
  }, [songToPlay]);

  useEffect(() => {
    if (audioRef.current) {
      const handleTimeUpdate = () => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
          setDuration(audioRef.current.duration);
        }
      };
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        }
      };
    }
  }, [songToPlay]);

  const songToDisplay = songToPlay || previousSong;

  if (!songToDisplay) {
    return <div className="music-player">Loading song...</div>;
  }

  const playTrack = () => {
    setIsPlaying(true);
    audioRef.current.play();
    if (isLoggedIn && userId) {
      saveListeningHistory(userId, songToDisplay.id)
        .then((data) => {
          console.log('Listening history saved successfully:', data);
        })
        .catch((error) => {
          console.error('Error saving listening history:', error);
        });
    }
  };

  const pauseTrack = () => {
    setIsPlaying(false);
    audioRef.current.pause();
  };

  const handleNext = () => {
    const currentIndex = playlist.findIndex(song => song.id === songToDisplay.id);
    const nextSong = playlist[(currentIndex + 1) % playlist.length];
    setSongToPlay(nextSong);
    
    setPlaylist(prevPlaylist => {
      if (!prevPlaylist.some(song => song.id === nextSong.id)) {
        return [nextSong, ...prevPlaylist.filter(song => song.id !== nextSong.id)];
      }
      return prevPlaylist;
    });

    setShowPlaylist(false);
  };

  const handlePrevious = () => {
    const currentIndex = playlist.findIndex(song => song.id === songToDisplay.id);
    const prevSong = playlist[(currentIndex - 1 + playlist.length) % playlist.length];
    setSongToPlay(prevSong);

    setPlaylist(prevPlaylist => {
      if (!prevPlaylist.some(song => song.id === prevSong.id)) {
        return [prevSong, ...prevPlaylist.filter(song => song.id !== prevSong.id)];
      }
      return prevPlaylist;
    });

    setShowPlaylist(false);
  };
  const saveListeningHistory = (song) => {
    const currentHistory = JSON.parse(localStorage.getItem('listeningHistory')) || [];
    const newHistory = [...currentHistory, {
      songId: song.id,
      name: song.name,
      artist: song.artist,
      cover_url: song.cover_url,
      timestamp: new Date().toISOString(),
    }];
    console.log('Saving to history:', newHistory);  // Kiểm tra dữ liệu trước khi lưu
    localStorage.setItem('listeningHistory', JSON.stringify(newHistory));
  };
  
  

  

  const handleProgressChange = (e) => {
    const newTime = e.target.value;
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  const togglePlaylist = () => {
    setShowPlaylist(prevState => !prevState);
  };

  const handleRepeat = () => {
    setIsRepeating(prevState => !prevState);
  };


  const handleSongEnd = () => {
    if (audioRef.current) {
      if (isRepeating) {
        playTrack();
      } else {
        handleNext();
      }
      // Lưu lịch sử khi bài hát kết thúc
      saveListeningHistory(songToPlay);
    }
  };
  
  const handlePlayListContinuation = (song) => {
    setSongToPlay(song);
    setIsPlaying(true);
    audioRef.current.play();
  };
  

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <div className="music-player">
      <div className="player-controls">


        <button onClick={handlePrevious}>
          <IoMdSkipBackward />
        </button>
        {isPlaying ? (
          <button onClick={pauseTrack}>
            <IoIosPause />
          </button>
        ) : (
          <button onClick={playTrack}>
            <IoMdPlay />
          </button>
        )}
        <button onClick={handleNext}>
          <IoMdSkipForward />
        </button>
        <button onClick={loadRandomPlaylist}>
          <IoIosShuffle />
        </button>
        <button onClick={handleRepeat} style={{ color: isRepeating ? 'orange' : 'black' }}>
          <RiRepeatLine />
        </button>

        <button onClick={togglePlaylist}>
          <CiBoxList />
        </button>

        {/* Nút âm thanh */}
        <div className="volume-control">
          {volume === 0 ? (
            <IoVolumeMute />
          ) : volume < 0.5 ? (
            <IoVolumeLowSharp />
          ) : (
            <IoVolumeMedium />
          )}
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="volume-slider"
          />
        </div>
      </div>

      <audio ref={audioRef} src={songToDisplay.file_url} onEnded={handleSongEnd} />



      <div className="progress-bar">
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime}
          onChange={handleProgressChange}
        />
        <div className="time-info">
          <span>{formatTime(currentTime)}</span> / <span>{formatTime(duration)}</span>
        </div>
      </div>
      <div className="player-details">
        <img src={songToDisplay.cover_url} alt={songToDisplay.name} />
        <h3>{songToDisplay.name || 'Loading song...'}</h3>
        <p>{songToDisplay.artist || 'Unknown Artist'}</p>
      </div>

      {showPlaylist && (
        <div className="playlist-details">
          <h4>Current Playlist: {currentPlaylist ? currentPlaylist.name : 'Unknown Playlist'}</h4>
          <ul>
            {playlist.slice(0, 5).map((song) => (
              <li key={song.id} onClick={() => handlePlayListContinuation(song)}>{song.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;
