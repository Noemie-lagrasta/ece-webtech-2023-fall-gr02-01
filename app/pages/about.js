import Head from 'next/head'
import Image from 'next/image'
import Layout from '../components/Layout.js'

export default function Page() {
  return (
    <Layout>
      <Head>
        <title>WebTech - About us</title>
        <meta name="description" content="Don't be shy, drop us an email" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="wt-center">
      <div className="wt-welcome">
        ABOUT US
      </div>
      </main>
      <br/><br/>

      <div className="wt-texte">
        We are 2 engineering students at ECE Paris.<br/> And this is one of our homework in Web Technologies, it will evoluate gradually. <br/> For the moment, you can navigate on it.
      </div>
      <div className="flex items-center justify-between px-40">
        <div className='wt-presentation'>ARIANE AUBRUN<br/> ______________<br/><br/> Co-president</div>
        <div className='wt-presentation'>NOEMIE LAGRASTA<br/>______________<br/> <br/> Co-president</div>
      </div>

        


    </Layout>
  )
}
