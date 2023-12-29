import { useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Layout from '../../../components/Layout.js';
import OutlineUserCircleIcon from '@heroicons/react/outline/UserCircleIcon';
import { ChevronLeftIcon } from '@heroicons/react/solid';
import Link from 'next/link';
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import sanitizeHtml from 'sanitize-html';
import { useUser } from '../../../components/UserContext.js';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function Travels({ id }) {
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const supabase = useSupabaseClient();
  const { user, darkMode } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [replyDone, setReplyDone] = useState(false);

  const handlereply = () => {
    setIsOpen(true);
    console.log("Want to reply");
  }

  const handleMessageChange = (value) => {
    setMessage(value);
  };

  const onSubmit = async function (e) {
    e.preventDefault();
    setIsOpen(false);
    setReplyDone(true);

    const formData = new FormData(e.target);
    const sanitizedMessage = sanitizeHtml(message, { allowedTags: [], allowedAttributes: {} });

    if (user) {
      try {
        const { data: newContact, error } = await supabase
          .from('contacts')
          .insert([
            {
              firstname: null,
              lastname: null,
              email: user.email,
              message: sanitizedMessage,
              reply: true,
            },
          ],
            { returning: 'minimal' }
          );

        if (error) {
          throw error;
        }

        console.log('Success', newContact);
        // Assuming setContactDone is defined somewhere
        // setContactDone(true);
      } catch (error) {
        console.error('Error submitting contact information:', error.message);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('contacts')
          .select('id, firstname, lastname, email, message, reply')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        setContact(data);
        console.log("data:", data);
      } catch (error) {
        console.error('Error fetching post:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return (
    <Layout>
      <div>
        <div className={`mt-20 flex items-center ${darkMode ? 'dark-writting' : 'light-writting'}`}>
          <ChevronLeftIcon className="h-10 w-10" aria-hidden="true" />
          <Link href='/admin/contacts/allcontacts' className="ml-2">GO BACK</Link>
        </div>
        <br /><br />

        {loading ? (
          <p>Loading...</p>
        ) : (
          contact &&
          <>
            <div>
              <h3 className={`text-4xl font-bold mb-2  ${darkMode ? 'dark-writting' : 'light-writting'}`}> from: {contact.email}</h3>
              <h3 className={`text-4xl font-bold mb-2  ${darkMode ? 'dark-writting' : 'light-writting'}`}>{contact.firstname} {contact.lastname}</h3>
              <div className='px-10 py-10 text-justify bg-white overflow-hidden shadow rounded-lg text-black'>
                <div dangerouslySetInnerHTML={{ __html: contact.message }} />
              </div>
            </div>
            {!replyDone &&


              <button className={`fixed bottom-60 right-10 mb-4 mr-4 px-4 py-4 bg-${darkMode ? 'blue' : 'orange'}-500 text-white font-bold text-xl hover:underline rounded-md`} onClick={handlereply}>
                Reply
              </button>
            }

            {isOpen && (
              <form className={`grid gap-3 text-center rounded-md w-96 p-8 bg-${darkMode ? 'blue' : 'orange'}-500`} onSubmit={onSubmit}>
                <div className={`flex text-center font-bold text-xl ${darkMode ? 'text-black' : 'text-white'}`}>
                  from: team-contact@webtrips.fr
                </div>
                <div className='flex flex-grow'>
                  <label>
                    {typeof window !== 'undefined' && (
                      <ReactQuill
                        value={message}
                        onChange={handleMessageChange}
                        className='rounded-md flex-grow'
                        style={{ maxWidth: '600px' }}
                        placeholder='Write here the answer '
                      />
                    )}
                  </label>
                </div>
                <div>
                  <button
                    className="rounded py-1 px-3 text-white bg-slate-500 hover:bg-blue-500"
                  >
                    Send
                  </button>
                </div>
              </form>
            )}
          </>
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
