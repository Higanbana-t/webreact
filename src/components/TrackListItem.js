// src/components/TrackListItem.js
import React from 'react';

const TrackListItem = ({ track }) => {
  return (
    <div className="playableTile">
      <div className="playableTile__artwork">
        <a href={`/discover/sets/${track.title}`} className="playableTile__artworkLink">
          <div className="playableTile__image">
            {/* Placeholder image */}
            <div className="image image__lightOutline sc-artwork" style={{ height: '100%', width: '100%' }}>
              <span
                style={{ backgroundImage: `url('https://via.placeholder.com/150')`, width: '100%', height: '100%' }}
                className="sc-artwork"
                aria-label={`Track artwork for ${track.title}`}
              />
            </div>
          </div>
        </a>
        <div className="playableTile__imageOverlay"></div>

        <div className="playableTile__playButton">
          <a href={track.src} className="sc-button-play playButton sc-button" title="Play" draggable="true">
            Play
          </a>
        </div>

        <div className="playableTile__actions">
          <div className="playableTile__actionWrapper">
            <button type="button" className="sc-button-like" title="Like">Like</button>
            <button type="button" className="sc-button-more" title="Add">Add</button>
          </div>
        </div>
      </div>

      <div className="playableTile__description">
        <a className="playableTile__heading" href={`/discover/sets/${track.title}`}>
          {track.title}
        </a>
        <div className="playableTile__usernameHeadingContainer">
          <span className="playableTile__usernameHeading">
            {track.artist}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TrackListItem;
