import { useState, useEffect } from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import {supabase} from '@/utils/supabase'
import Layout from '@/components/Layout.js';
import { useRouter} from 'next/router';

//this page is  available for all
//it's a dedicated page for users who want to sign in/up
export default function Login() {
  const router = useRouter();
  const [session, setSession] = useState(null);


  //to get the current session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)  
    })

  
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)   
    })
      

    return () => subscription.unsubscribe()
  }, [])




  if (!session) {
    return (<Layout><Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} providers={['github']}/></Layout>)
  }
  else {
    router.push('/');
  }
};