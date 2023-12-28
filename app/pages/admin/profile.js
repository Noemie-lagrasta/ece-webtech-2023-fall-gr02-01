import Head from 'next/head';
import Link from 'next/link';
import Layout from '/components/Layout.js';
import { CogIcon } from '@heroicons/react/solid';

export default function Articles({ articles }) {
  return (
    <Layout>
      <div className='items-center'>
        <div className='text-6xl font-bold text-center'>
          Welcome to your personal Dashboard
        </div>

        <br /> <br /> <br />

        <div className='wt-choice'>
          <Link href='/admin/yourPosts'>Your posts</Link>
        </div>
        <br /> <br /> <br />

        <div className='wt-choice '>
          <Link href='/admin/ADDtravels'>Write a new post</Link>
        </div>

        <br /> <br /> <br />
        <div className='wt-choice flex justify-center'>
          <CogIcon className="h-12 w-12 mr-2" aria-hidden="true"></CogIcon>
          <Link href='/PersonalInfo'>See your personal information</Link>
        </div>
      </div>
    </Layout>
  );
}
