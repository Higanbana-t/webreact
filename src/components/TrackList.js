// src/components/TrackList.js
import React from 'react';
import TrackListItem from './TrackListItem'; // Import component TrackListItem

const TrackList = ({ tracks }) => {
  return (
    <div className="tileGallery">
      {tracks.map((track, index) => (
        <div key={index} className="tileGallery__sliderPanel">
          <TrackListItem track={track} />
        </div>
      ))}
    </div>
  );
};

export default TrackList;
