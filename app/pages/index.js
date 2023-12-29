import React from 'react';
import { useUser } from '../components/UserContext';
import Layout from '../components/Layout';

//this page is  available for all
//it's a dedicated home page
export default function Page() {
  const { darkMode } = useUser();

  return (
    <Layout>
      <main >
        <div className={`mt-32 mb-32 w-full flex items-center justify-center`}>
          <div className={`px-20 py-20 text-9xl font-bold text-center ${darkMode ? 'dark-components' : 'light-components'} border rounded-md`}>
          WEB&apos;TRIPS <br />

          </div>
        </div>

        <div className={`text-center mb-32 font-fold text-3xl font-bold ${darkMode ? 'dark-writting' : 'light-writting'}  rounded-md`}>
           Take a look at the posts made by our users about the trips they&apos;ve taken.
           <br/><br/>
        </div>
      </main>
    </Layout>
  );
}
