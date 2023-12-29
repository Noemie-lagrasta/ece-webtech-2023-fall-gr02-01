import React from 'react';
import { useUser } from '@/components/UserContext';

//this page is available for all webtrips users 
// this is a modal open when the user want to filter the travles displays.
// the filter is based on the different countries presents in the database
const FilterModal = ({ onClose, filtersCount, handleFilterClick }) => {
  const { darkMode } = useUser();

  return (
    <>
      {Array.isArray(filtersCount) && filtersCount.length > 0 ? (
        <div className="overlay">
          <div className={`modal ${darkMode ? 'dark-writting' : 'light-writting'}`}>
            <p>Which country?</p>
            <div className='flex px-3'>
              {filtersCount.map((filter, index) => (
                <button
                  key={index}
                  className={`rounded-md  px-2 py-2 rounded-md mr-2 ${darkMode ? 'border border-black' : 'border border-grey-300'}`}
                  name='count'
                  value={filter}
                  onClick={() => handleFilterClick(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
            <br /><br />
            <button className={`${darkMode ? 'dark-components' : 'light-components'} px-2 py-2 rounded-md`} onClick={() => onClose({ filtersCount })}>
              Start search
            </button>
          </div>
        </div>
      ) : (
        <p>No filters available</p>
      )}
    </>
  );
};

export default FilterModal;
