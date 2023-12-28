import Head from 'next/head';
import Link from 'next/link';
import Layout from '/components/Layout.js';
import { CogIcon } from '@heroicons/react/solid';
import { useUser } from '../../components/UserContext.js';

export default function Articles({ articles }) {
  const {user, darkMode}= useUser();
  return (
    <Layout>
      
      <div className='items-center'>
        <div className={`mt-20 text-6xl font-bold text-center ${darkMode ? 'dark-writting' : 'light-writting'}`}>
          Welcome to your personal Dashboard
        </div>

        <br /> <br /> <br />

        <div className={`px-5 py-5 text-5xl text-center font-bold border rounded-md hover:scale-150 ${darkMode ? 'dark-components' : 'light-components'}`}>
          <Link href='/admin/yourPosts'>Your posts</Link>
        </div>
        <br /> <br /> <br />

        <div className={`px-5 py-5 text-5xl text-center font-bold border rounded-md hover:scale-150 ${darkMode ? 'dark-components' : 'light-components'}`}>
          <Link href='/admin/ADDtravels'>Write a new post</Link>
        </div>

        <br /> <br /> <br />
        <div className={` flex items-center justify-center px-5 py-5 text-5xl text-center font-bold border rounded-md hover:scale-150 ${darkMode ? 'dark-components' : 'light-components'}`}>
          <CogIcon className="h-12 w-12 mr-2" aria-hidden="true"></CogIcon>
          <Link href='/admin/PersonalInfo'>See your personal information</Link>
        </div>
      </div>
    </Layout>
  );
}
