import { useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Layout from '../../components/Layout.js';
import OutlineUserCircleIcon from '@heroicons/react/outline/UserCircleIcon';
import { ChevronLeftIcon, PencilIcon } from '@heroicons/react/solid';
import Link from 'next/link.js';
import axios from 'axios';
import { useUser } from '@/components/UserContext.js'

//this page is only available for the user himself
//it's a dedicated page to modify the post, he had already published
export default function Travels({ id }) {
  const [travel, setTravels] = useState(null);
  const [loading, setLoading] = useState(true);
  const supabase = useSupabaseClient();
  const [isDestOpen, setDestOpen] = useState(false);
  const [isNameOpen, setNameOpen] = useState(false);
  const [isTimeOpen, setTimeOpen] = useState(false);
  const [isToolOpen, setToolOpen] = useState(false);
  const [isStoryOpen, setStoryOpen] = useState(false);
  const [modifcation, setModif] = useState(false);
  const [countries, setCountries] = useState([]);
  const { darkMode } = useUser();

  //to get all the information from the travel post [selected] to update
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


//when the user, submit un update
  const onSubmit = async function (e) {
    e.preventDefault();
    setDestOpen(false);
    setNameOpen(false);
    setTimeOpen(false);
    setToolOpen(false);
    setStoryOpen(false);

    const formData = new FormData(e.target);

// because the user select the duration by using 2 select input we have to contract them
    const days = formData.get('days');
    const measure = formData.get('measure');
    const travelDays = days && measure ? days + ' ' + measure : travel.TravelDays;


    //object to get the update fields
    const fields = {};
    formData.forEach((value, key) => {
      if (value.trim() !== '' && key !== 'days' && key !== 'measure') {
        fields[key] = value;
      }
    });

    //to update the database with the update fields
    try {
      const { data: newContact, error } = await supabase
        .from('travels')
        .upsert(
          [
            {
              id: travel.id,
              ...fields,
              TravelDays: travelDays,
            },
          ],
          { onConflict: ['id'], returning: 'representation' }
        );

      if (error) {
        throw error;
      }

      console.log('Upsert successful:', newContact);
      fetchData();
    } catch (error) {
      console.error('Error in the upsert:', error);
    }
  };

  //to get all the countries names if he want to modify the destination, he'll have to precise again the country
  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const response = await axios.get('http://api.geonames.org/countryInfoJSON', {
          params: {
            username: 'aariane', // Remplacez par votre nom d'utilisateur GeoNames
          },
        });

        const countryList = response.data.geonames.map((item) => item.countryName);

        setCountries(countryList);
      } catch (error) {
        console.error('Erreur lors de la récupération des données géographiques:', error);
      }
    };

    fetchCountry();
  }, []);

  useEffect(() => {
    fetchData();
  }, [id]);

  //if the user want to modify the destination
  const handleModifDest = () => {
    setDestOpen(true);
    setModif(true);
  };
  //if the user want to modify his name
  const handleModifName = () => {
    setNameOpen(true);
    setModif(true);
  };
  //if the user want to modify the duration
  const handleModifTime = () => {
    setTimeOpen(true);
    setModif(true);
  };
  // if the user want to modify his way od transport
  const handleModifTool = () => {
    setToolOpen(true);
    setModif(true);
  };
  // if the user want to modify the content of his post
  const handleModifStory = () => {
    setStoryOpen(true);
    setModif(true);
  };
//if he want to concel any modification he wanted to do
  const cancelDest = () => {
    setDestOpen(false);
    setModif(false);
  };
  const cancelName = () => {
    setNameOpen(false);
    setModif(false);
  };
  const cancelTime = () => {
    setTimeOpen(false);
    setModif(false);
  };
  const cancelTool = () => {
    setToolOpen(false);
    setModif(false);
  };
  const cancelStory = () => {
    setStoryOpen(false);
    setModif(false);
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
                      <div className={`flex text-5xl ml-20 font-bold ${darkMode ? 'dark-writting' : 'light-writting'}`}>
                        {travel.TravelDest}
                        <div className='ml-auto justify-center mr-5 text-center font-bold text-black text-xl'>
                          <button className={`flex items-center rounded-md border border-grey-300 ${darkMode ? 'dark-writting' : 'light-writting'}`} onClick={handleModifDest}>
                            <PencilIcon className="h-5 w-5" aria-hidden="true" />
                            Modify the destination
                          </button>
                          {isDestOpen && (
                            <div>
                              <form className="[&_span]:block grid gap-3" onSubmit={onSubmit}>
                                <div>
                                  <label>
                                    New destination:
                                    <input type="text" name="TravelDest" className='rounded-md' placeholder='i.e: Paris' />
                                  </label>
                                  <label>
                                    <span>Pleace, precise the country</span>
                                    <select name="TravelCountry" className='rounded-md'>
                                      {countries.map((country, index) => (
                                        <option key={index} value={country}>
                                          {country}
                                        </option>
                                      ))}
                                    </select>
                                  </label>
                                </div>
                                <div>
                                  <button className={`rounded py-1 px-3 text-white bg-slate-500 ${darkMode ? 'hover:bg-blue-500' : 'hover:bg-orange-500'}`} >Update destination</button>

                                </div>
                              </form>
                              {modifcation && (
                                <button className="flex items-center rounded-md border border-grey-300" onClick={cancelDest}>
                                  cancel
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <br /><br />
                      <div className={`flex items-center mb-10 ml-20  ${darkMode ? 'dark-writting' : 'light-writting'}`}>
                        <OutlineUserCircleIcon width={30} height={30} />
                        <span className="ml-2">
                          {travel.TravelerName}
                        </span>
                        <div className='ml-auto  mr-5 justify-center text-center font-bold text-black text-xl'>
                          <button className={`flex items-center rounded-md border border-grey-300 ${darkMode ? 'dark-writting' : 'light-writting'}`} onClick={handleModifName}>
                            <PencilIcon className="h-5 w-5" aria-hidden="true" />
                            Modify your name
                          </button>
                          {isNameOpen && (
                            <div>
                              <form className="[&_span]:block grid gap-3" onSubmit={onSubmit}>
                                <div>
                                  <label>
                                    New Name:
                                    <input type="text" name="TravelerName" className='rounded-md' placeholder='i.e: Paris' />
                                  </label>
                                </div>
                                <div>
                                  <button className={`rounded py-1 px-3 text-white bg-slate-500 ${darkMode ? 'hover:bg-blue-500' : 'hover:bg-orange-500'}`} >Update destination</button>

                                </div>
                              </form>
                              {modifcation && (
                                <button className="flex items-center rounded-md border border-grey-300" onClick={cancelName}>
                                  cancel
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className={`flex ml-10 ml-32 mb-5  ${darkMode ? 'dark-writting' : 'light-writting'}`}>
                        {travel.TravelDays}
                        <div className='ml-auto mr-5 justify-center text-center font-bold text-black text-xl'>
                          <button className={`flex items-center rounded-md border border-grey-300 ${darkMode ? 'dark-writting' : 'light-writting'}`} onClick={handleModifTime}>
                            <PencilIcon className="h-5 w-5" aria-hidden="true" />
                            Modify the duration of your trip
                          </button>
                          {isTimeOpen && (
                            <div>
                              <form className="[&_span]:block grid gap-3" onSubmit={onSubmit}>
                                <div>
                                  <label>
                                    <span>HNew duration</span>
                                    <select name="days" className='rounded-md'>
                                      <option>1</option>
                                      <option>2</option>
                                      <option>3</option>
                                      <option>4</option>
                                      <option>5</option>
                                      <option>6</option>
                                      <option>7</option>
                                      <option>8</option>
                                      <option>9</option>
                                      <option>10</option>
                                      <option>11</option>
                                      <option>12</option>
                                      <option>13</option>
                                    </select>
                                    <select name="measure" className='rounded-md'>
                                      <option>days</option>
                                      <option>weeks</option>
                                      <option>months</option>
                                    </select>
                                  </label>
                                </div>
                                <div>
                                  <button className="flex rounded py-1 px-3 text-white bg-slate-500 hover:bg-orange-500">Update duration</button>

                                </div>
                              </form>
                              {modifcation && (
                                <button className="flex items-center rounded-md border border-grey-300" onClick={cancelTime}>
                                  cancel
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                        <br /><br />
                      </div>
                      <div className={`flex ml-10 ml-32  mb-5  ${darkMode ? 'dark-writting' : 'light-writting'}`}>
                        by  {travel.TravelTools}
                        <div className='ml-auto  mr-5 justify-center text-center font-bold text-black text-xl'>
                          <button className={`flex items-center rounded-md border border-grey-300 ${darkMode ? 'dark-writting' : 'light-writting'}`} onClick={handleModifTool}>
                            <PencilIcon className="h-5 w-5" aria-hidden="true" />
                            Modify the duration of your trip
                          </button>
                          {isToolOpen && (
                            <div>
                              <form className="[&_span]:block grid gap-3" onSubmit={onSubmit}>
                                <div>
                                  <label>
                                    <span>New way of transport</span>
                                    <input type="radio" name="TravelTools" value="car" className='ml-auto' /> by car <br />
                                    <input type="radio" name="TravelTools" value="plane" className='ml-auto' /> by plane<br />
                                    <input type="radio" name="TravelTools" value="boat" className='ml-auto' /> by boat<br />
                                    <input type="radio" name="TravelTools" value="bus" className='ml-auto' /> by bus<br />
                                    <input type="radio" name="TravelTools" value="train" className='ml-auto' /> by train<br />
                                  </label>
                                </div>
                                <div>
                                  <button className={`rounded py-1 px-3 text-white bg-slate-500 ${darkMode ? 'hover:bg-blue-500' : 'hover:bg-orange-500'}`} >Update transport</button>

                                </div>
                              </form>
                              {modifcation && (
                                <button className="flex items-center rounded-md border border-grey-300" onClick={cancelTool}>
                                  cancel
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className='w-1/3 items-center'>
                      <div className='px-10 py-10 text-justify bg-white overflow-hidden shadow rounded-lg text-black mb-10'>
                        <div dangerouslySetInnerHTML={{ __html: travel.TravelStory }} />                      </div>

                      <div className='ml-10 justify-center text-center font-bold text-black text-xl'>
                        <button className={`flex items-center rounded-md border border-grey-300 ${darkMode ? 'dark-writting' : 'light-writting'}`} onClick={handleModifStory}>
                          <PencilIcon className="h-5 w-5" aria-hidden="true" />
                          Modify the content of your post
                        </button>
                        {isStoryOpen && (
                          <div className='mr-32 items-center justify-center'>
                            <form className="[&_span]:block grid gap-3" onSubmit={onSubmit}>
                              <div className='flex '>
                                <label>
                                  New content
                                  <textarea name="TravelStory" className='rounded-md' placeholder='It was a really good trip. I recommand it!' />
                                </label>
                              </div>
                              <div>
                                <button className={`rounded py-1 px-3 text-white bg-slate-500 ${darkMode ? 'hover:bg-blue-500' : 'hover:bg-orange-500'}`} >Update your content</button>

                              </div>
                            </form>
                            {modifcation && (
                              <button className=" ml-32 flex items-center rounded-md border border-grey-300" onClick={cancelStory}>
                                cancel
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </td>


                  </tr>
                </tbody>
              </table>
              <div className={`fixed bottom-60 right-10 mb-4 mr-4 px-4 py-4 bg-${darkMode ?'blue':'orange'}-500 text-white font-bold text-xl hover:underline rounded-md`}>
                <Link href={`/admin/posts/${travel.id}`}>
                  See reviews on your post
                </Link>
              </div>

            </>

          )

        )}
      </div>


    </Layout >
  );
}

export async function getServerSideProps(context) {
  return {
    props: {
      id: context.params.id
    },
  };
}