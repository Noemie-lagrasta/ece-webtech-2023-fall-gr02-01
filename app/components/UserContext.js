import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/utils/supabase';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const session = supabase.auth.getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    })


    return () => subscription.unsubscribe()
  }, []);


  const Hlogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  const value = {
    session,
    user,
    Hlogout
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>

};

export const useUser = () => useContext(UserContext);
