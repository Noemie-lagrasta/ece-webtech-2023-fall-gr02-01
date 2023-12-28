import React, { useState } from 'react';

const StarRating = ({ onRate }) => {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);

  const handleStarHover = (starValue) => {
    setHoveredRating(starValue);
  };

  const handleStarClick = (starValue) => {
    setSelectedRating(starValue);
    if (onRate) {
      onRate(starValue);
    }
  };

  const handleMouseLeave = () => {
    setHoveredRating(0);
  };

  return (
    <div>
      {[1, 2, 3, 4, 5].map((starValue) => (
        <span className='wt-star'
          key={starValue}
          onClick={() => handleStarClick(starValue)}
          onMouseEnter={() => handleStarHover(starValue)}
          onMouseLeave={handleMouseLeave}
          style={{
            cursor: 'pointer',
            color: starValue <= (hoveredRating || selectedRating) ? 'gold' : 'gray',
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
