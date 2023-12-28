import { useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Layout from '../../../components/Layout.js';
import OutlineUserCircleIcon from '@heroicons/react/outline/UserCircleIcon';
import { ChevronLeftIcon } from '@heroicons/react/solid';
import Link from 'next/link.js';
import { useUser } from '/components/UserContext.js';

export default function Travels({ id }) {
  const [travel, setTravels] = useState(null);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const supabase = useSupabaseClient();
  const { user } = useUser();
  const [commentaires, setCommentaire] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let { data, error } = await supabase
          .from('travels')
          .select('id, TravelerName, TravelDest, TravelDays, TravelStory')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        setTravels(data);
      } catch (error) {
        console.error('Error fetching post choose:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchAverageRating = async () => {
      try {
        const { data, error, status } = await supabase
          .from('ratings')
          .select('rate')
          .eq('postid', travel?.id);

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          const sum = data.reduce((acc, rating) => acc + rating.rate, 0);
          const average = sum / data.length;
          setAverageRating(average);
        }
      } catch (error) {
        console.error('Error fetching average rating:', error.message);
      }
    };

    if (travel) {
      fetchAverageRating();
    }
  }, [travel]);

  

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data, error, status } = await supabase
          .from('ratings')
          .select('id, emailofrater, emailofauthor, postid, comments')
          .eq('emailofauthor', user.email);

        setCommentaire(data);
        if (error) {
          throw error;
        }
      } catch (error) {
        console.error('Error updating rating:', error.message);
      }
    };

    fetchComments();
  }, [commentaires]);

  return (
    <Layout>
      <br /><br />
      <div className="flex items-center">
        <ChevronLeftIcon className="h-10 w-10" aria-hidden="true" />
        <Link href='/travels' className="ml-2">GO BACK</Link>
      </div>
      <br /><br />
      <br /><br />
      {loading ? (
        <p>Loading...</p>
      ) : (
        travel && (
          <table className="table-auto w-full">
            <tbody>
              <tr>
                <td className='w-1/3'>
                  <div className='text-5xl font-bold'>
                    {travel.TravelDest}
                  </div>
                  <br /><br />
                  <div className='flex items-center'>
                    <OutlineUserCircleIcon width={30} height={30} />
                    <span className="ml-2">
                      {travel.TravelerName}
                    </span>
                  </div>
                  <br />
                </td>
                <td className='w-1/3 items-center'>
                  <div className='px-10 py-10 text-justify bg-white overflow-hidden shadow rounded-lg ' >
                    <div>
                      {travel.TravelStory}
                    </div>
                  </div>
                </td>
                <td className=' grid justify-items-end'>
                  <div className='wt-rate'>Your post has been rated: {averageRating.toFixed(2)}/5</div>
                  <div className="grid md:grid-rows ">
                    {commentaires && commentaires.length > 0 ? (
                      <>
                        {commentaires.map((comm) => (
                          <div key={comm.id} className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-4">
                              <h3 className="text-xl font-bold mb-2">{comm.emailofrater} commented: </h3>
                              <p className="text-slate-500 mb-2">{comm.comments}</p>
                            </div>
                          
                          </div>
                        ))}
                      </>
                    ) : (
                      <p>No comments have been left yet</p>
                    )}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        )
      )}
    </Layout>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {
      id: context.params.id
    },
  }
}
