import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import Layout from '@/components/Layout';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Link from 'next/link';
import { ChevronRightIcon, PencilAltIcon, TrashIcon } from '@heroicons/react/solid';
import Modal from 'react-modal';
import Router, { useRouter } from 'next/router';
import { useUser } from '@/components/UserContext';

// Import MapContainer dynamically to ensure it works with SSR
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), {
  ssr: false,
});

// Other Leaflet components
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const GeoJSON = dynamic(() => import('react-leaflet').then((mod) => mod.GeoJSON), { ssr: false });

const MapComponent = () => {
  const [position, setPosition] = useState(null);
  const [countryInfo, setCountryInfo] = useState(null);
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [postExist, setPostExist] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [articlesPerPage] = useState(2);
  const supabase = useSupabaseClient();
  const { user, darkMode } = useUser();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [travelToDelete, setTravelToDelete] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Define handleCountryInfo in the global scope only on the client side
    if (typeof window !== 'undefined') {
      window.handleCountryInfo = (data) => {
        console.log('Country Info Response:', data);
        setCountryInfo(data);
        const script = document.querySelector('script[src*="geonames"]');
        script.parentNode.removeChild(script);
      };
    }
  }, []);

  const getCountryInfo = (lat, lon) => {
    if (typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.src = `https://secure.geonames.org/countryCodeJSON?lat=${lat}&lng=${lon}&username=aariane&callback=handleCountryInfo`;
      document.head.appendChild(script);
    }
  };

  const handleMoveend = (event) => {
    const center = event.target.getCenter();
    console.log('Map Moveend:', center.lat, center.lng);
    setPosition([center.lat, center.lng]);
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = async () => {
    setModalOpen(false);
  };

  const handleDeleteClick = (travel) => {
    setTravelToDelete(travel);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleteModalOpen(false);

    console.log('a delete:', travelToDelete.id);

    if (travelToDelete) {
      let { data, error } = await supabase
        .from('travels')
        .delete()
        .eq('id', travelToDelete.id);

      if (error) {
        console.error('Error deleting travel:', error);
      }
    }

    fetchTravelsIn();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json');
        const data = await response.json();
        setGeoJsonData(data);
      } catch (error) {
        console.error('Erreur lors du chargement des données GeoJSON', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    Modal.setAppElement('#__next');
    if (countryInfo) {
      fetchTravelsIn();
    }
  }, [countryInfo]);

  const fetchTravelsIn = async () => {
    try {
      if (countryInfo) {
        let { data, error } = await supabase
          .from('travels')
          .select('id, TravelerName, TravelDest, TravelCountry, TravelDays, TravelStory, Travelemail, TravelTools')
          .eq('TravelCountry', countryInfo.countryName);

        setPostExist(data);

        if (error) {
          throw error;
        }
      }
    } catch (error) {
      console.error('Error fetching travels:', error.message);
    }
  };

  const onEachFeature = (feature, layer) => {
    layer.on({
      click: (e) => {
        if (typeof window !== 'undefined') {
          const { lat, lng } = e.latlng;
          getCountryInfo(lat, lng);
          fetchTravelsIn(); // Update: Fetch travels when clicking on a feature
        }
      },
    });
  };

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = postExist.slice(indexOfFirstArticle, indexOfLastArticle);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Layout>
      <div className="flex mt-6 mb-6">
        <div className="w-3/4">
          {typeof window !== 'undefined' && (
            <MapContainer
              center={[0, 0]}
              zoom={2}
              style={{ width: '100%', height: '700px' }}
              onMoveend={handleMoveend}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              {geoJsonData && (
                <GeoJSON
                  data={geoJsonData}
                  style={() => ({
                    fillColor: darkMode ? 'blue' : 'orange',
                    color: 'white',
                    weight: 2,
                  })}
                  onEachFeature={onEachFeature}
                />
              )}


            </MapContainer>
          )}
        </div>
        <div className="w-1/4 p-4">
          {countryInfo && (
            <>
              <div className={`text-4xl text-center font-bold uppercase mb-4 ${darkMode ? 'dark-writting' : 'light-writting'}`}>
                {countryInfo.countryName}<br />__________________________
              </div>
              {currentArticles.length > 0 ? (
                currentArticles.map((travel) => (
                  <div key={travel.id} className="w-110 bg-white overflow-hidden shadow rounded-lg"
                  >
                    <div className="p-4">
                      <h3 className="text-3xl text-black font-bold mb-2 ">{travel.TravelDest}</h3>
                      <p className="text-slate-500 mb-2">{travel.TravelerName}</p>
                      <p className="text-slate-500">{travel.TravelDays} </p>
                      <p className='text-slate-500'>by {travel.TravelTools}</p>
                      <p className="text-slate-500 mt-2">{travel.TravelStory.slice(0, 70)} ....</p>
                    </div>
                    <div className="p-4 flex justify-between items-center">
                      <Link
                        href={`/travels/${travel.id}`}
                        className={`w-5 h-5 rounded-full block ${darkMode ? 'text-black bg-slate-200 hover:bg-blue-500' : 'text-black bg-slate-200 hover:bg-orange-500'} `}
                        >
                        <ChevronRightIcon className="h-5 w-5 " aria-hidden="true" />
                      </Link>
                      {user && user.email === travel.Travelemail && (
                        <div className="flex items-center">
                          <Link
                            href={`/admin/posts/${travel.id}`}
                            className={`w-5 h-5 rounded-full block ${darkMode ? 'text-black bg-slate-200 hover:bg-blue-500' : 'text-black bg-slate-200 hover:bg-orange-500'} `}
                            >
                            <PencilAltIcon className="h-5 w-5" aria-hidden="true" />
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(travel)}
                            className={`w-5 h-5 rounded-full block ${darkMode ? 'text-black bg-slate-200 hover:bg-blue-500' : 'text-black bg-slate-200 hover:bg-orange-500'} `}
                            >
                            <TrashIcon className="h-5 w-5" aria-hidden="true" />
                          </button>
                          <Modal
                            isOpen={isDeleteModalOpen}
                            onRequestClose={() => setDeleteModalOpen(false)}
                            contentLabel="Delete Confirmation"
                            className="delete-modal"
                          >
                            <div className="border border-gray-300 p-4 rounded max-w-md mx-auto">
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
                ))
              ) : (
                <div className={`text-2xl text-center ${darkMode ? 'dark-writting' : 'light-writting'}`}>
                  <br />
                  There are no articles written yet about a destination in this country. <br /><br />
                  Have you been there ? <br /><br /><br />
                  {user ? (
                    <>
                      <Link href="/admin/ADDtravels" className={`text-2xl font-bold  rounded-md px-4 py-4 hover:underline  ${darkMode ? 'dark-components' : 'light-components'}`}>Add an article</Link>
                    </>
                  ) : (
                    <>
                      Log in to add an article
                    </>
                  )}
                </div>
              )}
              {postExist.length > articlesPerPage && (
                <div className="flex justify-center mt-4">
                  {Array.from({ length: Math.ceil(postExist.length / articlesPerPage) }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => paginate(index + 1)}
                      className={`mx-2 px-3 py-1 rounded ${currentPage === index + 1
                          ? darkMode
                            ? 'bg-blue-500 text-white'
                            : 'bg-orange-500 text-white'
                          : 'bg-gray-300 text-gray-700'
                        }`}
                    >
                      {index + 1}
                    </button>

                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MapComponent;
