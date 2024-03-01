import React from 'react';

const Finished = ({ winner }) => {
  console.log('Received winner:', winner); // Log received winner prop

  return (
    <div className="finished-container">
      <h1 className="finished-header">Voting Result</h1>
      <div className="result-details">
        <h2 className="result-message">Voting is finished</h2>
        {winner ? (
          <div>
            <h3 className="winner-label">The winner is:</h3>
            <p className="winner-name">{winner}</p>
          </div>
        ) : (
          <p className="no-winner-message">No winner declared yet.</p>
        )}
      </div>
    </div>
  );
};

export default Finished;
