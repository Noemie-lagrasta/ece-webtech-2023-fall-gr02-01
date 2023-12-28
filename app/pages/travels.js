import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRightIcon, PencilAltIcon, TrashIcon } from '@heroicons/react/solid';
import { FilterIcon } from '@heroicons/react/solid';
import Layout from '/components/Layout.js';
import { supabase } from '@/utils/supabase';
import FilterModal from '@/pages/filters';
import { useUser } from '/components/UserContext.js';
import Modal from 'react-modal';


export default function Travels() {
  const [travels, setTravels] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [filtersCount, setFilterCountry] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({ filtersCount: [] });
  const { user } = useUser();
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [travelToDelete, setTravelToDelete] = useState(null);
  const fetchTravels = async () => {

    
    let { data, error } = await supabase
      .from('travels')
      .select(`id, TravelerName, TravelDest, TravelDays, TravelStory, TravelTools, Travelemail`);

    if (searchTerm.trim() === '') {
      setTravels(data || []);
    } else {
      let { data: searchData, error } = await supabase
        .from('travels')
        .select(`id, TravelerName, TravelDest, TravelDays, TravelStory,TravelTools`)
        .or(`TravelDest.ilike.%${searchTerm}%, TravelerName.ilike.%${searchTerm}%, TravelTools.ilike.%${searchTerm}%`);

      if (error) {
        console.log('Error: ', error);
      }

      setTravels(searchData && searchData.length > 0 ? searchData : data || []);
    }
  };


  const handleDeleteClick = (travel) => {
    setTravelToDelete(travel);
    setDeleteModalOpen(true);
  };
  const handleDeleteConfirm = async () => {
    setDeleteModalOpen(false);

    console.log('a delete:', travelToDelete.id)
  
    if (travelToDelete) {
      let { data, error } = await supabase
        .from('travels')
        .delete()
        .eq('id', travelToDelete.id); // Use eq() to match the 'id' field
  
      if (error) {
        console.error('Error deleting travel:', error);
      }
    }

    fetchTravels();
  };
  
  
  
  useEffect(() => {
    
    fetchTravels(); // Now fetchTravels is defined before being called
  }, [searchTerm]);

  useEffect(() => {
    Modal.setAppElement('#__next')
    const fetchFilters = async () => {
      try {
        const { data: countData, error: countError } = await supabase
          .from('travels')
          .select('TravelCountry', { distinct: true });

        if (countError) {
          console.error('Error fetching filter names:', countError);
          return;
        }

        setFilterCountry([...new Set(countData.map((filter) => filter.TravelCountry))]);

      } catch (error) {
        console.error('Error fetching filter names:', error);
      }
    };

    fetchFilters();
  }, []);

  const handleFilterClick = (selectedFilter) => {
    setSelectedFilters((prevFilters) => {
      return { ...prevFilters, filtersCount: [...prevFilters.filtersCount, selectedFilter] };
    });
  };
  const clearFilters = () => {
    setSelectedFilters({ filtersCount: [] });
    setModalOpen(false);
    const fetchTravels = async () => {
      let { data, error } = await supabase
        .from('travels')
        .select(`id, TravelerName, TravelDest, TravelDays, TravelStory, TravelTools`);

      if (searchTerm.trim() === '') {
        setTravels(data || []);
      } else {
        let { data: searchData, error } = await supabase
          .from('travels')
          .select(`id, TravelerName, TravelDest, TravelDays, TravelStory,TravelTools`)
          .or(`TravelDest.ilike.%${searchTerm}%, TravelerName.ilike.%${searchTerm}%, TravelTools.ilike.%${searchTerm}%`);

        if (error) {
          console.log('Error: ', error);
        }

        setTravels(searchData && searchData.length > 0 ? searchData : data || []);
      }
    }
    fetchTravels();
    ;
  };


  const openModal = () => {
    setModalOpen(true);
  };

  const fetchFilteredTravels = async (filters) => {
    try {
      let data; // Declare 'data' variable here
  
      if (filters != null) {
        const { data: filteredData, error } = await supabase
          .from('travels')
          .select(`id, TravelerName, TravelDest, TravelDays, TravelStory, TravelTools, TravelCountry`)
          .in('TravelCountry', filters);
  
        if (error) {
          console.error('Error fetching filtered travels:', error);
          return;
        }
  
        data = filteredData; // Assign 'filteredData' to 'data'
      } else {
        let { data: allData, error } = await supabase
          .from('travels')
          .select(`id, TravelerName, TravelDest, TravelDays, TravelStory, TravelTools`);
  
        data = allData; // Assign 'allData' to 'data'
      }
  
      setTravels(data || []);
    } catch (error) {
      console.error('Error handling filters change:', error);
    }
  };
  

  const closeModal = async () => {
    setModalOpen(false);
    fetchFilteredTravels(selectedFilters.filtersCount);
  };

  return (
    <Layout title="All travels" description="Generated by create next app">
      <div className="mb-4">
        <input
          type="text"
          placeholder="a city, a web'tripper, way to travel ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full"
        />
      </div>

      <div className="flex space-x-4">
        <button className="flex items-center rounded-md border border-grey-300" onClick={openModal}>
          <FilterIcon className="h-5 w-5" aria-hidden="true" />
          FILTER POSTS
        </button>
        {selectedFilters.filtersCount.length > 0 && (
          <button className="flex items-center rounded-md border border-grey-300" onClick={clearFilters}>
            CLEAR FILTER
          </button>
        )}
      </div>
      <br /><br />
      {isModalOpen && (
        <FilterModal
          onClose={closeModal}
          filtersCount={filtersCount}
          handleFilterClick={handleFilterClick}
        />
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {travels.map((travel) => (
          <div
            key={travel.id}
            className={`bg-white overflow-hidden shadow rounded-lg`}
          >
            <div className="p-4">
              <h3 className="text-4xl font-bold mb-2 ">{travel.TravelDest}</h3>
              <p className="text-slate-500 mb-2">{travel.TravelerName}</p>
              <p className="text-slate-500">{travel.TravelDays} </p>
              <p className='text-slate-500'>by {travel.TravelTools}</p>
              <p className="text-slate-500 mt-2">{travel.TravelStory.slice(0, 100)} ....</p>
            </div>
            <div className="p-4 flex justify-between items-center">
              <Link
                href={`/travels/${travel.id}`}
                className="w-5 h-5 block bg-slate-200 hover:bg-blue-500 hover:text-white rounded-full"
              >
                <ChevronRightIcon className="h-5 w-5 " aria-hidden="true" />
              </Link>
              {user && user.email === travel.Travelemail && (
                <div className="flex items-center">
                  <Link
                    href={`/admin/posts/${travel.id}`}
                    className="w-5 h-5 block bg-slate-200 hover:bg-blue-500 hover:text-white rounded-full"
                  >
                    <PencilAltIcon className="h-5 w-5" aria-hidden="true" /></Link>
                  <button onClick={() => handleDeleteClick(travel)}>
                    <TrashIcon className="h-5 w-5 ml-2" aria-hidden="true" />
                  </button>
                  <Modal
                    isOpen={isDeleteModalOpen}
                    onRequestClose={() => setDeleteModalOpen(false)}
                    contentLabel="Delete Confirmation"
                    className="delete-modal" // Apply the class here
                  >
                    <div className="border border-gray-300 p-4 rounded max-w-md mx-auto"> {/* Apply Tailwind classes here */}
                      <p className="mb-4">Are you sure you want to delete this travel?</p>
                      <div className="flex justify-end">
                        <button
                          onClick={handleDeleteConfirm}
                          className="bg-red-500 text-white px-4 py-2 mr-2 rounded"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setDeleteModalOpen(false)}
                          className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                        >
                          No
                        </button>
                      </div>
                    </div>
                  </Modal>


                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}