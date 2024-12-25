import React, { useState, useEffect } from 'react';
import './ListeningHistory.css';
const ListeningHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Lấy lịch sử từ localStorage khi component được load
    const storedHistory = JSON.parse(localStorage.getItem('listeningHistory')) || [];
    setHistory(storedHistory);
  }, []);

  return (
    <div className="listening-history">
      <h2>Listening History</h2>
      {history.length > 0 ? (
        <ul>
          {history.map((item, index) => (
            <li key={index} className="history-item">
              {item.cover_url ? (
                <img src={item.cover_url} alt={item.name} className="history-cover" />
              ) : (
                <div className="no-cover">Không có hình</div>
              )}
              <div className="history-details">
                <strong>{item.name}</strong> 
                <br />
                <small>{new Date(item.timestamp).toLocaleString()}</small>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Không có lịch sử nào</p>
      )}
    </div>
  );
};

export default ListeningHistory;

