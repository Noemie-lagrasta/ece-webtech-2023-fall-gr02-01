import { useState, useEffect } from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import {supabase} from '@/utils/supabase'
import Layout from '@/components/Layout.js';
import { useRouter} from 'next/router';


export default function Login() {
  const router = useRouter();
  const [session, setSession] = useState(null);


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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
};

  if (!session) {
    return (<Layout><Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} providers={['github']}/></Layout>)
  }
  else {
    router.push('/');
  }
}