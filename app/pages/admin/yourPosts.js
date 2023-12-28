import { useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Layout from '/components/Layout.js';
import { ChevronRightIcon } from '@heroicons/react/solid';
import Link from 'next/link';
import { useUser } from '/components/UserContext.js';

export default function Travels() {
    const [travels, setTravels] = useState([]);
    const [loading, setLoading] = useState(true);
    const supabase = useSupabaseClient();
    const { user } = useUser();

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
                <div className="grid md:grid-rows ">
                    {travels.map((travel) => (
                        <div key={travel.id} className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-4">
                                <h3 className="text-2xl font-bold mb-2">{travel.TravelDest}</h3>
                                <p className="text-slate-500 mb-2"> {travel.TravelerName}</p>
                                <p className="text-slate-500">{travel.TravelDays} </p>
                                <p className="text-slate-500 mt-2">{travel.TravelStory}</p>
                            </div>
                            <div className="p-4 flex items-center justify-end">
                                <Link href={`/admin/posts/${travel.id}`} className="text-black-500 hover:underline">
                                    <span  className="ml-2">See Reviews</span>
                                    <ChevronRightIcon className="h-10 w-10 ml-1" aria-hidden="true" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Layout>
    );
}
