import { useState, useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/utils/supabase';
import Layout from '@/components/Layout.js';
import { useRouter } from 'next/router';
import { darkMode } from '@/tailwind.config';
import { useUser } from '@/components/UserContext';

// This page is available for all
// It's a dedicated page for users who want to sign in/up
export default function Login() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const {darkMode}= useUser();

  // To get the current session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return (
      <Layout>
        {/* Apply Tailwind CSS class to set the background to white */}
        <div className={`p-8 ${darkMode ? 'dark-components' : 'light-components'} rounded-md mt-32`}>
          <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} providers={['github']} />
        </div>
      </Layout>
    );
  } else {
    router.push('/');
  }
}
