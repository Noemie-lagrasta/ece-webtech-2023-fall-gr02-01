import { useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Layout from '../../components/Layout.js';
import OutlineUserCircleIcon from '@heroicons/react/outline/UserCircleIcon';
import { ChevronLeftIcon, ChatAltIcon } from '@heroicons/react/solid';
import Link from 'next/link.js';
import { useUser, getGravatarUrl } from '/components/UserContext.js';
import StarRating from '/pages/RatingSys';

//this page is only available for tauthentificate users
//it's a dedicated page which display all the information on the selecte dposts: rates, content, comments
export default function Travels({ id }) {
  const [travel, setTravel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const supabase = useSupabaseClient();
  const { user, darkMode } = useUser();
  const [value, setRate] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [commentaire, setCommentaire] = useState("");
  const [isRevOpen, setRevOpen] = useState(false);
  const [modification, setModification] = useState(false);
  const [comments, setComments] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  //to make a pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [commentsPerPage] = useState(2);
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = comments.slice(indexOfFirstComment, indexOfLastComment);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // to get the content of the seected post
  const fetchTravelData = async () => {
    try {
      let { data, error, status } = await supabase
        .from('travels')
        .select('id, TravelerName, TravelDest, TravelDays, TravelStory, Travelemail, TravelTools')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      setTravel(data);
      setDataLoaded(true);
      // to get the rate
      fetchAverageRating();
      fetchComments(data.id);
    } catch (error) {
      console.error('Error fetching travel data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  //to get all the rates of the selected article
  const fetchAverageRating = async () => {
    try {
      if (dataLoaded && travel) {
        const { data, error, status } = await supabase
          .from('ratings')
          .select('rate')
          .eq('postid', travel?.id);

        if (error) {
          throw error;
        }

        //calcul of the average
        if (data && data.length > 0) {
          const sum = data.reduce((acc, rating) => acc + rating.rate, 0);
          const average = sum / data.length;
          setAverageRating(average);
        }
      }
    } catch (error) {
      console.error('Error fetching average rating:', error.message);
    }
  };

  //calcul to get all the comments on this articles: comments or replies
  const fetchComments = async (postId) => {
    try {
      const { data, error, status } = await supabase
        .from('ratings')
        .select('id, emailofrater, emailofauthor, postid, comments, parentId')
        .eq('postid', postId);

      setComments(data);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error fetching comments:', error.message);
    }
  };

  useEffect(() => {
    fetchTravelData();
  }, [id]);

  useEffect(() => {
    if (travel) {
      fetchAverageRating();
    }
  }, [travel, dataLoaded]);

  //when the user submit a rate
  const handleRate = (value) => {
    setRate(value);
  };

  //when the user submit a review, so me insert the globality in the ratings database
  const Validate = async () => {
    setRevOpen(false);
    try {
      const { data, error, status } = await supabase
        .from('ratings')
        .upsert(
          [
            {
              emailofrater: user?.email,
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

      setSubmitting(true);
      //we calcul again the average after this new review
      fetchAverageRating();
      //we fetch again the comments to get all the new submitted comments
      fetchComments(travel.id);
    } catch (error) {
      console.error('Error updating rating:', error.message);
    }
  };

  //if the user want to submit a review
  const handleRevOpen = () => {
    setRevOpen(true);
    setModification(true);
  };

  const cancelRev = () => {
    setRevOpen(false);
    setModification(false);
  };

  return (
    <Layout>
      <div>
      <div className={`mt-20 flex items-center ${darkMode ? 'dark-writting':'light-writting'}`}>
          <ChevronLeftIcon className="h-10 w-10" aria-hidden="true" />
          <Link href='/travels' className="ml-2">GO BACK</Link>
        </div>
        <br /><br />

        {loading ? (
          <p>Loading...</p>
        ) : (
          travel && (
            <>
              <table className="table-auto w-full mt-32">
                <tbody>
                  <tr>
                    <td className='w-1/3'>
                      <div className={`text-5xl ml-20 font-bold ${darkMode ? 'dark-writting' : 'light-writting'}`}>
                        {travel.TravelDest}
                      </div>
                      <br /><br />
                      <div className={`flex items-center mb-10 ml-20  ${darkMode ? 'dark-writting' : 'light-writting'}`}>
                        <OutlineUserCircleIcon width={30} height={30} />
                        <span className="ml-2">
                          {travel.TravelerName}
                        </span>
                      </div>
                      <div className={`ml-10 ml-32 mb-5  ${darkMode ? 'dark-writting' : 'light-writting'}`}>
                        {travel.TravelDays}
                        <br /><br />
                      </div>
                      <div className={`ml-10 ml-32  mb-5  ${darkMode ? 'dark-writting' : 'light-writting'}`}>
                        by  {travel.TravelTools}
                      </div>
                    </td>

                    <td className='w-1/3 items-center'>
                      <div className='px-10 py-10 text-justify bg-white overflow-hidden shadow rounded-lg text-black'>
                        <div dangerouslySetInnerHTML={{ __html: travel.TravelStory }} />                      </div>
                    </td>

                    <td className='grid justify-items-end  mr-10'>

                      <>
                        <div className={`wt-rate mb-10 ${darkMode ? 'dark-writting' : 'light-writting'}`}>This post is rated: {averageRating.toFixed(2)}/5</div>

                        {user ? (
                          <>
                            {isRevOpen ? (
                              <>
                                <div className='ml-auto justify-center mr-5 text-center font-bold text-black text-xl mb-10'>
                                  <StarRating onRate={handleRate} />
                                  <textarea name='commentaire' className='rounded-md' placeholder='Your comment here' value={commentaire} onChange={(e) => setCommentaire(e.target.value)}></textarea>
                                  <button onClick={Validate} className="flex rounded py-1 px-3 text-white bg-slate-500 hover:bg-orange-500" disabled={submitting}>
                                    SUBMIT YOUR REVIEW
                                  </button>
                                  {modification && (
                                    <button className="flex items-center rounded-md border border-grey-300" onClick={cancelRev}>
                                      cancel
                                    </button>
                                  )}
                                </div>
                              </>) : (
                              <>
                                <div className='ml-auto justify-center mr-5 text-center text-xl mb-10'>
                                  <button className={`flex items-center rounded-md border border-grey-300 ${darkMode ? 'dark-writting' : 'light-writting'}`} onClick={handleRevOpen}>
                                    <ChatAltIcon className="h-5 w-5" aria-hidden="true" />
                                    Submit a review
                                  </button>
                                </div>
                              </>
                            )}
                          </>

                        ) : (
                          <div className='flex ml-auto justify-center mr-5 text-center text-black text-xl mb-10'>
                            <Link href='/login' className='hover:underline'>Log in</Link>
                            <p className="ml-2">to submit a review on this post</p>
                          </div>
                        )}

                        <div className="grid md:grid-rows ">
                          {comments && comments.length > 0 ? (
                            <>
                              {currentComments
                                .filter((comm) => !comm.parentId) // Exclude replies from the top-level comments
                                .map((comm) => (
                                  <div key={comm.id} className={`bg-white overflow-hidden shadow rounded-lg p-4 mb-4 `}>
                                    <div className="flex items-center">
                                      <img src={getGravatarUrl(comm.emailofrater)} alt="Gravatar" className="w-12 h-12 rounded-full" />
                                      <h3 className="ml-2 text-xl font-bold mb-2 text-black">{comm.emailofrater} commented: </h3>
                                    </div>
                                    <p className="ml-12 text-slate-500 mb-2">{comm.comments}</p>


                                    {comments.map((reply) => (
                                      reply.parentId === comm.id && (
                                        <div key={reply.id} className="ml-8 bg-gray-100 border-l-2 pl-2">
                                          <div className="flex items-center">
                                            <img src={getGravatarUrl(reply.emailofrater)} alt="Gravatar" className="w-10 h-10 rounded-full" />
                                            <h4 className="ml-2 text-lg font-semibold text-black">{reply.emailofauthor} replied: </h4>
                                          </div>
                                          <p className="ml-8 text-slate-600">{reply.comments}</p>
                                        </div>
                                      )
                                    ))}
                                  </div>
                                ))}
                            </>
                          ) : (
                            <p className={`${darkMode ? 'dark-writting' : 'light-writting'}`}>No comments have been left yet</p>
                          )}
                          {comments.length > commentsPerPage && (
                          <div className="flex justify-center mt-4">
                            {Array.from({ length: Math.ceil(comments.length / commentsPerPage) }, (_, index) => (
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

                        </div>
                      </>

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
