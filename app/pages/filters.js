import React from 'react';

const FilterModal = ({ onClose, filtersCount, handleFilterClick }) => {
  return (
    <div className="overlay">
      <div className="modal">
        <p>Which country?</p>
        <div className='flex px-3'>
          {filtersCount.map((filter, index) => (
            <button
              key={index}
              className='rounded-md border border-grey-300 px-2 py-2 rounded-md mr-2'
              name='count'
              value={filter}
              onClick={() => handleFilterClick(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
        <br /><br />
        <button className='bg-orange px-2 py-2 rounded-md' onClick={() => onClose({ filtersCount })}>
          Start search
        </button>

      </div>
    </div>
  );
};

export default FilterModal;
