import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout.js'

export default function Page() {
  return (
    <Layout>
    <main className="wt-center my-10">
      <div className="wt-welcome">
        WEB'TRIPS <br/> 
      </div>
     
      <div className='text-center font-fold text-black text-3xl font-bold'>
      <br/> <br/> <br/> <br/>
      Take a look at the posts made by our users about the trips they've taken.
      </div>
    </main>
  </Layout>
  )
}
