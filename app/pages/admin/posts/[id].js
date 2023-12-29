import { useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Layout from '../../../components/Layout.js';
import OutlineUserCircleIcon from '@heroicons/react/outline/UserCircleIcon';
import { ChevronLeftIcon, ChatAlt2Icon } from '@heroicons/react/solid';
import Link from 'next/link';
import { useUser, getGravatarUrl } from '/components/UserContext.js';

//this page is only available for the user himself
//it's a dedicated page which display all the information on his post: his posts, the rates, the comments and the possibility to reply
export default function Travels({ id }) {
  const [travel, setTravel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const supabase = useSupabaseClient();
  const { user, darkMode } = useUser();
  const [commentaires, setCommentaires] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [replyStates, setReplyStates] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [commentsPerPage] = useState(2);

  //to make a pagination, only 6/page
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = commentaires.slice(indexOfFirstComment, indexOfLastComment);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  //to save when the user replied a comment: to make nested comments
  const handleModifReply = (commentId) => {
    setReplyStates((prevStates) => ({
      ...prevStates,
      [commentId]: {
        hasReplied: prevStates[commentId] ? prevStates[commentId].hasReplied : false,
        isOpen: !prevStates[commentId]?.isOpen,
      },
    }));
  };

  //to insert in database the reply of the comment
  const handleReplySubmit = async (e, parentId) => {
    e.preventDefault();
    setReplyStates((prevStates) => ({
      ...prevStates,
      [parentId]: { hasReplied: true, isOpen: false },
    }));
    

    try {
      await supabase
        .from('ratings')
        .insert([
          {
            emailofrater: user.email,
            emailofauthor: travel.Travelemail,
            postid: id,
            comments: replyText,
            //to know which comments its replies to
            parentId: parentId,
          },
        ]);

        //after the insert, we get again the comments from the databse to see the new ones
      const { data: updatedComments, error } = await supabase
        .from('ratings')
        .select('id, emailofrater, emailofauthor, postid, comments, parentId')
        .eq('postid', id);

      if (error) {
        throw error;
      }

      setCommentaires(updatedComments);
      setReplyText("");
    } catch (error) {
      console.error('Error submitting reply:', error.message);
    }
  };

  //function to fetch all the informations of the user post
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('travels')
          .select('id, TravelerName, TravelDest, TravelDays, TravelStory, Travelemail, TravelTools')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        setTravel(data);
      } catch (error) {
        console.error('Error fetching post:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  //function to fetch all the rates of the user post to make an average
  useEffect(() => {
    const fetchAverageRating = async () => {
      try {
        const { data, error } = await supabase
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
      } catch (error) {
        console.error('Error fetching average rating:', error.message);
      }
    };

    if (travel) {
      fetchAverageRating();
    }
  }, [travel]);

  //function to fetch all the comments of the user post
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data, error } = await supabase
          .from('ratings')
          .select('id, emailofrater, emailofauthor, postid, comments, parentId')
          .eq('postid', id);

        if (error) {
          throw error;
        }

        setCommentaires(data);
      } catch (error) {
        console.error('Error updating rating:', error.message);
      }
    };

    fetchComments();
  }, [id]);

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
                        <div dangerouslySetInnerHTML={{ __html: travel.TravelStory }} />
                      </div>
                    </td>

                    <td className='grid justify-items-end mr-10'>
                      <div className={`wt-rate mb-10 ${darkMode ? 'dark-writting' : 'light-writting'}`}>This post is rated: {averageRating.toFixed(2)}/5</div>

                      <div className="grid md:grid-rows ">
                        {commentaires && commentaires.length > 0 ? (
                          <>
                            {currentComments
                              .filter((comm) => !comm.parentId)
                              .map((comm) => (
                                <div key={comm.id} className={`bg-white overflow-hidden shadow rounded-lg p-4 mb-4 `}>
                                  <div className="flex items-center">
                                    <img src={getGravatarUrl(comm.emailofrater)} alt="Gravatar" className="w-12 h-12 rounded-full" />
                                    <h3 className="ml-2 text-xl font-bold mb-2 text-black">{comm.emailofrater} commented: </h3>
                                  </div>
                                  <p className="ml-12 text-slate-500 mb-2">{comm.comments}</p>

                                  <div className='justify-center text-center text-black text-xl'>
                                    <button className="flex items-center rounded-md border border-grey-300" onClick={() => handleModifReply(comm.id)}>
                                      <ChatAlt2Icon className="h-5 w-5" aria-hidden="true" />
                                      Reply
                                    </button>

                                    <br /><br />
                                    {replyStates[comm.id]?.isOpen && (
                                      <div>
                                        <form onSubmit={(e) => handleReplySubmit(e, comm.id)}>
                                          <textarea
                                            placeholder="Reply to this comment..."
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            className='rounded-md'
                                          />
                                          <button type="submit">Reply</button>
                                        </form>
                                      </div>
                                    )}

                                  </div>

                                  {commentaires.map((reply) => (
                                    reply.parentId === comm.id && (
                                      <div key={reply.id} className="ml-8 bg-gray-100 border-l-2 pl-2">
                                        <div className="flex items-center">
                                          <img src={getGravatarUrl(reply.emailofrater)} alt="Gravatar" className="w-10 h-10 rounded-full" />
                                          <h4 className="ml-2 text-lg font-semibold text-black">You replied: </h4>
                                        </div>
                                        <p className="ml-8 text-slate-600">{reply.comments}</p>
                                      </div>
                                    )
                                  ))}
                                </div>
                              ))}

                          </>
                        ) : (
                          <p>No comments have been left yet</p>
                        )}
                        {commentaires.length > commentsPerPage && (
                          <div className="flex justify-center mt-4">
                            {Array.from({ length: Math.ceil(commentaires.length / commentsPerPage) }, (_, index) => (
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
      id: context.params.id,
    },
  };
}
