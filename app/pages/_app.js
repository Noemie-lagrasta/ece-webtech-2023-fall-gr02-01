import { SessionContextProvider } from '@supabase/auth-helpers-react';
import '@/styles/globals.css';
import { UserProvider } from '@/components/UserContext';
import {supabase} from '/utils/supabase.js'

;

export default function App({ Component, pageProps }) {
  return (
    <SessionContextProvider
      supabaseClient={supabase}
      initialSession={pageProps.initialSession}
    >
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </SessionContextProvider>
  );
}
