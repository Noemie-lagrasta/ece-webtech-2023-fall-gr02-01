import Head from 'next/head'
import Image from 'next/image'
import Layout from '../components/Layout.js'
import { useUser } from '../components/UserContext.js'

//this page is alvailable for everybody
//it's a dedicated page for rhe webtrip's team
export default function Page() {
  const { darkMode } = useUser();
  return (
    <Layout>
      <Head>
        <title>WebTech - About us</title>
        <meta name="description" content="Don't be shy, drop us an email" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main >
        <div className={`mt-32 mb-12 w-full flex items-center justify-center`}>

          <div className={`px-20 py-20 text-9xl font-bold text-center ${darkMode ? 'dark-components' : 'light-components'} border rounded-md`}>
            ABOUT US
          </div>
        </div>
        <div className="wt-texte">
          We are 2 engineering students at ECE Paris.<br /> And this is our project in Web Technologies<br /> You can navigate on it.
        </div>
        <div className="flex items-center justify-between px-40 mb-6">
          <div className={`px-4 py-4 text-2xl font-bold text-center ${darkMode ? 'dark-components' : 'light-components'} border rounded-md`}>
            ARIANE AUBRUN<br /> ______________<br /><br /> Co-president</div>
          <div className={`px-4 py-4 text-2xl font-bold text-center ${darkMode ? 'dark-components' : 'light-components'} border rounded-md`}>
            NOEMIE LAGRASTA<br />______________<br /> <br /> Co-president</div>
        </div>
      </main>
    </Layout>
  )
}
