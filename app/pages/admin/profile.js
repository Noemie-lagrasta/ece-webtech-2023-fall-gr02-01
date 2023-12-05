import Head from 'next/head'
import Link from 'next/link'
import Layout from '/components/Layout.js';

export default function Articles({ articles }) {
  return (
    <Layout>
      <div className='items-center'>
        <div className='text-6xl font-bold text-center'>
          Welcome to your personal Dashboard
        </div>

        <br/>   <br/>   <br/>

          <div className='wt-choice'>
            <Link href='/admin/yourPosts'>Your posts</Link>
          </div>
          <br/>   <br/>   <br/>

          <div className='wt-choice '>
            <Link href='/ADDtravels'>Write a new post</Link>
          </div>

          <br/>   <br/>   <br/>
          <div className='wt-choice'>
            <Link href='/'>Change your personal informations</Link>
          </div>
      </div>
    </Layout>
  )
}
