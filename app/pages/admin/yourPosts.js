import { useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Layout from '/components/Layout.js';
import { ChevronRightIcon, PencilAltIcon,TrashIcon } from '@heroicons/react/solid';
import Link from 'next/link';
import { useUser } from '/components/UserContext.js';
import Modal from 'react-modal';

export default function Travels() {
    const [travels, setTravels] = useState([]);
    const [loading, setLoading] = useState(true);
    const supabase = useSupabaseClient();
    const { user, darkMode } = useUser();
    const [currentPage, setCurrentPage] = useState(1);
    const [articlesPerPage] = useState(2);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [travelToDelete, setTravelToDelete] = useState(null);

    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = travels.slice(indexOfFirstArticle, indexOfLastArticle);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
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
    
        fetchData();
      };
    


    const fetchData = async () => {
        try {
            if (user && user.email) {
                let { data, error } = await supabase
                    .from('travels')
                    .select('id, TravelerName, TravelDest, TravelDays, TravelStory, Travelemail')
                    .eq('Travelemail', user.email);

                setTravels(data);

                if (error) {
                    throw error;
                }

                setTravels(data || []);
            } else {
                console.error('User or user email is null or undefined.');
            }
        } catch (error) {
            console.error('Error fetching travels:', error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    return (
        <Layout>
            {loading ? (
                <p>Loading travels...</p>
            ) : (
                <div className='mt-32'>
                    {currentArticles.map((travel) => (
                        <div
                            key={travel.id}
                            className={`bg-white overflow-hidden shadow rounded-lg mx-auto w-[50%] mb-8`}
                        >
                            <div className="p-4">
                                <h3 className="text-2xl text-black font-bold mb-2">{travel.TravelDest}</h3>
                                <p className="text-slate-500 mb-2"> {travel.TravelerName}</p>
                                <p className="text-slate-500">{travel.TravelDays} </p>
                                <p className="text-slate-500 mt-2">{travel.TravelStory}</p>
                            </div>
                            <div className="p-4 flex items-center justify-end text-black">
                                <Link href={`/admin/posts/${travel.id}`} className="flex text-black-500 hover:underline">
                                    <span className="ml-2">See Reviews</span>
                                    <ChevronRightIcon className="h-10 w-10 ml-1" aria-hidden="true" />
                                </Link>
                                <div className="flex items-center">
                                    <Link
                                        href={`/edit/${travel.id}`}
                                        passHref
                                        className="w-5 h-5 block bg-slate-200 hover:bg-orange-500 hover:text-white rounded-full">
                                        <PencilAltIcon className="h-5 w-5" aria-hidden="true" />
                                    </Link>
                                    <button
                                        onClick={() => handleDeleteClick(travel)}
                                        className={`w-5 h-5 rounded-full block ${darkMode ? 'bg-slate-200 hover:bg-blue-500' : 'bg-slate-200 hover:bg-orange-500'} `}
                                    >
                                        <TrashIcon className="h-5 w-5" aria-hidden="true" />
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
                            </div>
                            </div>
                   ) )}
                            {travels.length > articlesPerPage && (
                                <div className="flex justify-center mt-4">
                                    {Array.from({ length: Math.ceil(travels.length / articlesPerPage) }, (_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => paginate(index + 1)}
                                            className={`mx-2 px-3 py-1 rounded ${currentPage === index + 1 ? `bg-${darkMode ? 'blue' : 'orange'}-500 text-white` : 'bg-gray-300 text-gray-700'}`}

                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </Layout>
            );
}
