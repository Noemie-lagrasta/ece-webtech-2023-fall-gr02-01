import { useState } from 'react';
import Layout from '/components/Layout.js';
import { supabase } from '@/utils/supabase';
import { useUser } from '/components/UserContext.js';
import { ChatAlt2Icon } from '@heroicons/react/solid';
import { PencilIcon } from '@heroicons/react/outline';

//this page is only available for the user himself
//it's a dedicated page from his persnal dashboard: he can  update its' personal information
export default function Articles({ articles }) {
    const [newPassword, setNewPassword] = useState('');
    const [activeSection, setActiveSection] = useState('dashboard');
    const [isNickOpen, setNickOpen] = useState(false);
    const [isPhoneOpen, setPhoneOpen] = useState(false);
    const [isAddOpen, setAddOpen] = useState(false);
    const { user, darkMode } = useUser();
    const [modifcation, setmodif] = useState(false);
    const [isPassOpen, setPassOpen] = useState(false);

    //update the password by using the supabase function
    const handlePasswordUpdate = async () => {
        try {
            const { user, error } = await supabase.auth.updateUser({ password: newPassword });

            if (error) {
                console.error("Error updating password:", error.message);
            } else {
                console.log("Password updated successfully for user:", user);
            }
        } catch (e) {
            console.error("An unexpected error occurred:", e.message);
        }
    };

    //to insert the update in the database users
    const onSubmit = async function (e) {
        e.preventDefault();
        setAddOpen(false);
        setNickOpen(false);
        setPhoneOpen(false);

        const formData = new FormData(e.target);

        //object to get only the update fields, because they don't need to bee all updated
        const updatedFields = {};

        formData.forEach((value, key) => {
            if (value.trim() !== '') {
                updatedFields[key] = value;
            }
        });

        try {
            const { data: newContact, error } = await supabase
                .from('users')
                .upsert(
                    [
                        {
                            id: user.id,
                            email: user.email,
                            ...updatedFields,
                        },
                    ],
                    { onConflict: ['id'] }
                );

            if (error) {
                throw error;
            }

        } catch (error) {
            console.error('Error in the upsert:', error);
        }
    };


    //if the user want to add or update a nickname
    const handleModifNICKClick = () => {
        setNickOpen(true);
        setmodif(true);
    };
    //if the user want to add or update a phone number
    const handleModifPHOClick = () => {
        setPhoneOpen(true);
        setmodif(true);

    };
    //if the user want to add or update a personal address
    const handleModifADDClick = () => {
        setAddOpen(true);
        setmodif(true);

    };
    //if the user want to update his password
    const handleModifPassClick = () => {
        setPassOpen(true);
    };

    //if the user want to cancel the wish to add or update a nickname
    const cancelNick = () => {
        setNickOpen(false);
    };
    //if the user want to cancel the wish to add or update a phone number
    const cancelPho = () => {
        setPhoneOpen(false);
    };
    //if the user want to cancel the wish to add or update a personal address
    const cancelAdd = () => {
        setAddOpen(false);
    };
    //if the user want to cancel the wish to aupdate the password
    const cancelPass = () => {
        setPassOpen(false);
    };


    //inside of this page there is a menu: dashboard, update passwoard, add or update personal informaitons
    const renderSection = () => {
        switch (activeSection) {
            //here the home page, possibility to contact the support
            case 'dashboard':
                return (
                    <div>
                        <div className={`text-center font-bold text-5xl my-40 ${darkMode ? 'dark-writting' : 'light-writting'}`}>

                            {user && user.email ? (
                                <p>Welcome on your personal dashboard,
                                    <br /> {user.email}!</p>
                            ) : (
                                <p></p>
                            )}
                        </div>
                        
                        <a href='/contacts'>
                            <div className={`flex justify-center text-xl text-center hover:underline ${darkMode ? 'dark-writting' : 'light-writting'}`}>
                                <ChatAlt2Icon className="h-5 w-5 mr-5" ></ChatAlt2Icon>
                                Don&apos;t hesitate to contact us if you have any problems!
                            </div>

                        </a>
                    </div>
                );
            //here the passwoard update page, possibility to contact the support
            case 'password':
                return (
                    <div className='items-center'>
                        <div className='justify-center my-10 text-center font-bold text-black text-3xl'>
                            <button className={`flex items-center rounded-md border border-grey-300 ${darkMode ? 'dark-writting' : 'light-writting'}`} onClick={handleModifPassClick}>
                                <PencilIcon className="h-5 w-5" aria-hidden="true" />
                                Update your password
                            </button>

                            <br /><br />
                            {isPassOpen && (
                                <div>
                                    <form className="[&_span]:block grid gap-3" onSubmit={onSubmit}>
                                        <div className={`${darkMode ? 'dark-writting' : 'light-writting'}`}>
                                            <label>
                                                New Password:
                                                <input
                                                    type='password'
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    className='text-black'
                                                />
                                            </label>
                                        </div>
                                        <div>
                                            <button onClick={handlePasswordUpdate} className={`rounded py-1 px-3 text-white bg-slate-500 ${darkMode ? 'hover:bg-blue-500' : 'hover:bg-orange-500'}`} >Update Password</button>

                                        </div>
                                    </form>
                                    {modifcation && (
                                        <button className="flex items-center rounded-md border border-grey-300" onClick={cancelPass}>
                                            cancel
                                        </button>
                                    )}
                                </div>
                            )}

                        </div>
                        <a href='/contacts'>
                            <div className={`flex justify-center text-xl text-center hover:underline ${darkMode ? 'dark-writting' : 'light-writting'}`}>
                                <ChatAlt2Icon className="h-5 w-5 mr-5" ></ChatAlt2Icon>
                                Don&apos;t hesitate to contact us if you have any problems!
                            </div>

                        </a>
                    </div>
                );
            //here the personal infos page, possibility to contact the support
            case 'info':
                return (
                    <div className='justify-center my-10 '>
                        <div className='justify-center my-10 text-center font-bold text-black text-3xl'>
                            <div>
                                <button className={`flex items-center rounded-md border border-grey-300 ${darkMode ? 'dark-writting' : 'light-writting'}`} onClick={handleModifNICKClick}>
                                    <PencilIcon className="h-5 w-5" aria-hidden="true" />
                                    Add or update your nickname
                                </button>

                                <br /><br />
                                {isNickOpen && (
                                    <div>
                                        <form className="[&_span]:block grid gap-3" onSubmit={onSubmit}>
                                        <div className={`${darkMode ? 'dark-writting' : 'light-writting'}`}>
                                                <label>
                                                    <span>What is your nickname ?</span>
                                                    <input type="text" name="nickname" className='rounded-md text-black' placeholder='i.e: Jack STELLO' />
                                                </label>
                                            </div>
                                            <div>
                                                <button className={`rounded py-1 px-3 text-white bg-slate-500 ${darkMode ? 'hover:bg-blue-500' : 'hover:bg-orange-500'}`} >Save information</button>
                                            </div>
                                        </form>
                                        {modifcation && (
                                            <button className="flex items-center rounded-md border border-grey-300" onClick={cancelNick}>
                                                cancel
                                            </button>
                                        )}
                                    </div>
                                )}

                            </div>
                            <div>
                                <button className={`flex items-center rounded-md border border-grey-300 ${darkMode ? 'dark-writting' : 'light-writting'}`} onClick={handleModifPHOClick}>
                                    <PencilIcon className="h-5 w-5" aria-hidden="true" />
                                    Add or update your phone number
                                </button>

                                <br /><br />
                                {isPhoneOpen && (
                                    <div>
                                        <form className="[&_span]:block grid gap-3" onSubmit={onSubmit}>
                                        <div className={`${darkMode ? 'dark-writting' : 'light-writting'}`}>
                                                <label>
                                                    <span>What is your phone number?</span>
                                                    <input type="text" name="phone" className='rounded-md text-black' placeholder='i.e:0678976543' />
                                                </label>
                                            </div>
                                            <div>
                                                <button className={`rounded py-1 px-3 text-white bg-slate-500 ${darkMode ? 'hover:bg-blue-500' : 'hover:bg-orange-500'}`} >Save information</button>
                                            </div>
                                        </form>
                                        {modifcation && (
                                            <button className="flex items-center rounded-md border border-grey-300" onClick={cancelPho}>
                                                cancel
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div>
                                <button className={`flex items-center rounded-md border border-grey-300 ${darkMode ? 'dark-writting' : 'light-writting'}`} onClick={handleModifADDClick}>
                                    <PencilIcon className="h-5 w-5" aria-hidden="true" />
                                    Add or update your personal address
                                </button>

                                <br /><br />
                                {isAddOpen && (
                                    <div >
                                        <form className="[&_span]:block grid gap-3" onSubmit={onSubmit}>
                                        <div className={`${darkMode ? 'dark-writting' : 'light-writting'}`}>
                                                <label>
                                                    <span>What is your phone number?</span>
                                                    <input type="text" name="address" className='rounded-md text-black' placeholder='i.e: 36 quai de grenelle' />
                                                </label>
                                            </div>
                                            <div>
                                                <button className={`rounded py-1 px-3 text-white bg-slate-500 ${darkMode ? 'hover:bg-blue-500' : 'hover:bg-orange-500'}`} >Save information</button>
                                            </div>
                                        </form>
                                        {modifcation && (
                                            <button className="flex items-center rounded-md border border-grey-300" onClick={cancelAdd}>
                                                cancel
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>


                        <a href='/contacts'>
                            <div className={`flex justify-center text-xl text-center hover:underline ${darkMode ? 'dark-writting' : 'light-writting'}`}>
                                <ChatAlt2Icon className="h-5 w-5 mr-5" ></ChatAlt2Icon>
                                Don&apos;t hesitate to contact us if you have any problems!
                            </div>

                        </a>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <Layout>

            <div className='flex my-6 mt-32'>
                <div className='flex flex-col mr-40'>
                    <button onClick={() => setActiveSection('dashboard')} className={`px-10 py-10  text-4xl font-bold text-center  hover:scale-105 rounded-md ${darkMode ? 'dark-writting border border-grey-500' : ' light-writting border border-black'} mb-4`}>Your personal dashboard</button>
                    <button onClick={() => setActiveSection('password')} className={`px-10 py-10  text-4xl font-bold text-center  hover:scale-105 rounded-md ${darkMode ? 'dark-writting border border-grey-500' : ' light-writting border border-black'} mb-4`}>Change your password</button>
                    <button onClick={() => setActiveSection('info')} className={`px-10 py-10  text-4xl font-bold text-center  hover:scale-105 rounded-md ${darkMode ? 'dark-writting border border-grey-500' : ' light-writting border border-black'} mb-4`}>Complete your profile</button>
                </div>

                <div>
                    {renderSection()}
                </div>
            </div>
        </Layout>
    );
}
