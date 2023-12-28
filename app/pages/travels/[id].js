import { useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import md from 'markdown-it';
import Layout from '../../components/Layout.js';

import OutlineUserCircleIcon from '@heroicons/react/outline/UserCircleIcon';
import { ChevronLeftIcon } from '@heroicons/react/solid';
import Link from 'next/link.js';
import { useUser } from '/components/UserContext.js';
import StarRating from '/pages/RatingSys';

export default function Travels({ id }) {
  const [travel, setTravels] = useState(null);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const supabase = useSupabaseClient();
  const { user } = useUser();
  const [value, setRate] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [commentaire, setCommentaire] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // ici, nous récupérons toutes les informations du poste choisi
    const fetchData = async () => {
      try {
        let { data, error, status } = await supabase
          .from('travels')
          .select('id, TravelerName, TravelDest, TravelDays, TravelStory, Travelemail, TravelTools')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        setTravels(data);
      } catch (error) {
        console.error('Error fetching contact:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    // ici, nous calculons la moyenne de la note de ce poste
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

  const handleRate = (value) => {
    setRate(value);
  };

  // ici, nous envoyons la critique
  const Validate = async () => {
    try {
      const { data, error, status } = await supabase
        .from('ratings')
        .upsert(
          [
            {
              emailofrater: user.email,
              postid: travel.id,
              rate: value,
              comments: commentaire,
              emailofauthor: travel.Travelemail,
            },
          ],
          { onConflict: ['id', 'emailofrater', 'postid'] }
        );

      if (error) {
        throw error;
      }

      console.log('Rating submitted successfully:', data);
      setSubmitting(true);
      setSubmitted(true);
    } catch (error) {
      console.error('Error updating rating:', error.message);
    }
  };

  return (
    <Layout>
      <div>
        <div className="flex items-center">
          <ChevronLeftIcon className="h-10 w-10" aria-hidden="true" />
          <Link href='/travels' className="ml-2">GO BACK</Link>
        </div>
        <br /><br />
  
        {loading ? (
          <p>Loading...</p>
        ) : (
          travel && (
            <>
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
                        <br /><br />
                        <div>
                          {travel.TravelDays}
                          <br /><br />
                        </div>
                        <div>
                          by  {travel.TravelTools}
                        </div>
                      </div>
                    </td>
  
                    <td className='w-1/3 items-center'>
                      <div className='px-10 py-10 text-justify bg-white overflow-hidden shadow rounded-lg '>
                        {travel.TravelStory}
                      </div>
                    </td>
  
                    <td className='grid justify-items-end'>
                      {submitted ? (
                        <h1> Thanks for your review</h1>
                      ) : (
                        <>
                          <div className='wt-rate'>This post is rated: {averageRating.toFixed(2)}/5</div>
                          
                          {user ? (
                            <>
                              <StarRating onRate={handleRate} />
                              <textarea name='commentaire' placeholder='Your comment here' value={commentaire} onChange={(e) => setCommentaire(e.target.value)}></textarea>
                              <button onClick={Validate} className={`flex ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={submitting}>
                                SUBMIT YOUR REVIEW
                              </button>
                            </>
                          ) : (
                            <div className='flex'>
                              <Link href='/login'>Log in </Link> to leave a review on this post
                            </div>
                          )}
  
                        </>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </>
          )
        )}
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {
      id: context.params.id
    },
  };
}
