import { useState } from 'react';
import Head from 'next/head';
import Layout from '/components/Layout.js';
import { supabase } from '@/utils/supabase';
import { useUser } from '/components/UserContext.js';
import { ChatAlt2Icon } from '@heroicons/react/solid';
import { PencilIcon } from '@heroicons/react/outline';

export default function Articles({ articles }) {
    const [newPassword, setNewPassword] = useState('');
    const [activeSection, setActiveSection] = useState('dashboard');
    const [isNickOpen, setNickOpen] = useState(false);
    const [isPhoneOpen, setPhoneOpen] = useState(false);
    const [isAddOpen, setAddOpen] = useState(false);
    const { user } = useUser();
    const [modifcation, setmodif] = useState(false);


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

    const onSubmit = async function (e) {
        e.preventDefault();
        setAddOpen(false);
        setNickOpen(false);
        setPhoneOpen(false);

        const formData = new FormData(e.target);

        // Créer un objet pour stocker uniquement les champs renseignés
        const updatedFields = {};

        // Vérifier chaque champ et l'ajouter à l'objet s'il est renseigné
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
                            email: user.email,
                            ...updatedFields,
                        },
                    ],
                    { onConflict: ['email'] }
                );

            if (error) {
                throw error;
            }

            // Log ou traiter le succès de l'upsert
            console.log('Upsert successful:', newContact);
        } catch (error) {
            console.error('Error in the upsert:', error);
        }
    };


    const handleModifNICKClick = () => {
        setNickOpen(true);
        setmodif(true);
    };

    const handleModifPHOClick = () => {
        setPhoneOpen(true);
        setmodif(true);

    };
    const handleModifADDClick = () => {
        setAddOpen(true);
        setmodif(true);

    };

    const cancelNick = () => {
        setNickOpen(false);
    };

    const cancelPho = () => {
        setPhoneOpen(false);
    };
    const cancelAdd = () => {
        setAddOpen(false);
    };




    const renderSection = () => {
        switch (activeSection) {
            case 'dashboard':
                return (
                    <div>
                        <div className='text-center font-bold text-black text-5xl my-40'>

                            {user && user.email ? (
                                <p>Welcome on your personal dashboard,
                                    <br /> {user.email}!</p>
                            ) : (
                                <p></p>
                            )}
                        </div>
                        <a href='contacts'>
                            <div className='flex justify-center wt-affichage'>
                                <ChatAlt2Icon className="h-5 w-5 mr-5" ></ChatAlt2Icon>
                                Don't hesitate to contact us if you have any problems!
                            </div>

                        </a>
                    </div>
                );

            case 'password':
                return (
                    <div className='items-center'>
                        <p>Please, complet your profile</p>

                        <label>
                            New Password:
                            <input
                                type='password'
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </label>

                        <button onClick={handlePasswordUpdate} className='wt-option'>Update Password</button>
                        <a href='contacts'>
                            <div className='flex justify-center wt-affichage'>
                                <ChatAlt2Icon className="h-5 w-5 mr-5" ></ChatAlt2Icon>
                                Don't hesitate to contact us if you have any problems!
                            </div>

                        </a>
                    </div>
                );

            case 'info':
                return (
                    <div className='justify-center my-10 '>
                        <div className='justify-center my-10 text-center font-bold text-black text-3xl'>
                            <div>
                                <button className="flex items-center rounded-md border border-grey-300" onClick={handleModifNICKClick}>
                                    <PencilIcon className="h-5 w-5" aria-hidden="true" />
                                    Add or update your nickname
                                </button>

                                <br /><br />
                                {isNickOpen && (
                                    <div>
                                        <form className="[&_span]:block grid gap-3" onSubmit={onSubmit}>
                                            <div>
                                                <label>
                                                    <span>What is your nickname ?</span>
                                                    <input type="text" name="nickname" className='rounded-md' placeholder='i.e: Jack STELLO' />
                                                </label>
                                            </div>
                                            <div>
                                                <button
                                                    className="rounded py-1 px-3 text-white bg-slate-500 hover:bg-blue-500"
                                                >
                                                    Save information
                                                </button>
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
                                <button className="flex items-center rounded-md border border-grey-300" onClick={handleModifPHOClick}>
                                    <PencilIcon className="h-5 w-5" aria-hidden="true" />
                                    Add or update your phone number
                                </button>

                                <br /><br />
                                {isPhoneOpen && (
                                    <div>
                                        <form className="[&_span]:block grid gap-3" onSubmit={onSubmit}>
                                            <div>
                                                <label>
                                                    <span>What is your phone number?</span>
                                                    <input type="text" name="phone" className='rounded-md' placeholder='i.e:0678976543' />
                                                </label>
                                            </div>
                                            <div>
                                                <button
                                                    className="rounded py-1 px-3 text-white bg-slate-500 hover:bg-blue-500"
                                                >
                                                    Save information
                                                </button>
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
                                <button className="flex items-center rounded-md border border-grey-300" onClick={handleModifADDClick}>
                                    <PencilIcon className="h-5 w-5" aria-hidden="true" />
                                    Add or update your personal address
                                </button>

                                <br /><br />
                                {isAddOpen && (
                                    <div >
                                        <form className="[&_span]:block grid gap-3" onSubmit={onSubmit}>
                                            <div>
                                                <label>
                                                    <span>What is your phone number?</span>
                                                    <input type="text" name="address" className='rounded-md' placeholder='i.e: 36 quai de grenelle' />
                                                </label>
                                            </div>
                                            <div>
                                                <button
                                                    className="flex rounded py-1 px-3 text-white bg-slate-500 hover:bg-blue-500"
                                                >
                                                    Save information
                                                </button>
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


                        <a href='contacts'>
                            <div className='flex justify-center wt-affichage'>
                                <ChatAlt2Icon className="h-5 w-5 mr-5" ></ChatAlt2Icon>
                                Don't hesitate to contact us if you have any problems!
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
            <Head>
                <title>Update Password</title>
            </Head>
            <div className='flex my-6'>
                <div className='flex flex-col mr-40'>
                    <button onClick={() => setActiveSection('dashboard')} className='wt-option mb-4'>Your personal dashboard</button>
                    <button onClick={() => setActiveSection('password')} className='wt-option mb-4'>Change your password</button>
                    <button onClick={() => setActiveSection('info')} className='wt-option mb-4'>Complete your profile</button>
                </div>

                <div>
                    {renderSection()}
                </div>
            </div>
        </Layout>
    );
}
