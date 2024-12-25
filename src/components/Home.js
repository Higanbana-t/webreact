import React from 'react';
import DefaultRecommendations from './DefaultRecommendations';
import TopSong from './Topsong';

const Home = ({ onPlaySong, onPlayPlaylist }) => {
  return (
    <div className="Home">
      

      {/* Hiển thị DefaultRecommendations và TopSong với các hàm xử lý */}
      <DefaultRecommendations onPlayPlaylist={onPlayPlaylist} />
      <TopSong onPlaySong={onPlaySong} />
    </div>
  );
};

export default Home;

