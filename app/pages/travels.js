import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRightIcon, PencilAltIcon, TrashIcon } from '@heroicons/react/solid';
import { FilterIcon } from '@heroicons/react/solid';
import Layout from '/components/Layout.js';
import { supabase } from '@/utils/supabase';
import FilterModal from '@/pages/filters';
import { useUser } from '/components/UserContext.js';


export default function Travels() {
  const [travels, setTravels] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [filtersCount, setFilterCountry] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({ filtersCount: [] });
  const { user } = useUser();

  useEffect(() => {
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

    fetchTravels();
  }, [searchTerm]);

  useEffect(() => {
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
    setModalOpen(false); // Close the modal after clearing filters
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
  }


  const openModal = () => {
    setModalOpen(true);
  };

  const fetchFilteredTravels = async (filters) => {
    try {
      const { data, error } = await supabase
        .from('travels')
        .select(`id, TravelerName, TravelDest, TravelDays, TravelStory, TravelTools, TravelCountry`)
        .in('TravelCountry', filters);

      if (error) {
        console.error('Error fetching filtered travels:', error);
        return;
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
                  <PencilAltIcon className="h-5 w-5" aria-hidden="true" />
                  <TrashIcon className="h-5 w-5 ml-2" aria-hidden="true" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}