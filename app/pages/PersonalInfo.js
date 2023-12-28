import { useState } from 'react';
import Head from 'next/head';
import Layout from '/components/Layout.js';
import { supabase } from '@/utils/supabase';
import { useUser } from '/components/UserContext.js';
import { ChatAlt2Icon } from '@heroicons/react/solid';

export default function Articles({ articles }) {
    const [newPassword, setNewPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [activeSection, setActiveSection] = useState('dashboard'); // Default active section

    const { user } = useUser();

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

    const handleNicknameUpdate = async () => {
        // Add logic to update the user's nickname using Supabase
        // You might use supabase functions similar to handlePasswordUpdate
    };

    const renderSection = () => {
        switch (activeSection) {
            case 'dashboard':
                return (
                    <div>
                        <div className='text-center font-bold text-black text-5xl my-40'>

                            {user && user.email ? (
                                <p>Welcome on your personal dashboard,
                                    <br/> {user.email}!</p>
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
                        <p>Do you want to update your password?</p>

                        <label>
                            New Password:
                            <input
                                type='password'
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </label>

                        <button onClick={handlePasswordUpdate} className='wt-option'>Update Password</button>
                    </div>
                );

            case 'nickname':
                return (
                    <div className='items-center'>
                        <p>Do you want to add a nickname?</p>

                        <label>
                            Nickname:
                            <input
                                type='text'
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                            />
                        </label>

                        <button onClick={handleNicknameUpdate} className='wt-option'>Add Nickname</button>
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
                    <button onClick={() => setActiveSection('nickname')} className='wt-option mb-4'>Complete your profile</button>
                </div>

                {/* Main content */}
                <div>
                    {renderSection()}
                </div>
            </div>
        </Layout>
    );
}
