import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/utils/supabase';
import { MD5 } from 'crypto-js';

const UserContext = createContext();

//to get the gravatar by using the user.email
export const getGravatarUrl = (email) => {
  const gravatarUrl = `https://www.gravatar.com/avatar/${MD5(email.toLowerCase())}?s=150&d=identicon`;
  return gravatarUrl;
};

//construc the user strucuture
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    session: null,
    user: null,
    gravatar: null,
    darkMode: null,

  });

  //this function allow us to load the darkmoste state save in the database
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        supabase
          .from('users')
          .select('darkMode')  
          .eq('id', session.user.id)
          .then(({ data, error }) => {
            if (error) {
              console.error('Erreur lors de la récupération du mode sombre :', error.message);
            } else {
              //if there is not data in the database, the default value is false
              const darkMode = data?.[0]?.darkMode ?? false; 
              const gravatar = session.user.email ? `https://www.gravatar.com/avatar/${MD5(session.user.email.toLowerCase())}?s=150&d=identicon` : null;
              setUser({
                session,
                user: session.user ?? null,
                gravatar,
                darkMode,
              });
            }
          });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  //this function insert or update the user in the database if he modify the darkmode 
  useEffect(() => {
    if (user.session) {
      supabase
        .from('users')
        .upsert([
          {
            id: user.session.user.id,
            email: user.session.user.email,
            darkMode: user.darkMode,
          },
        ])
        .then(({ data, error }) => {
          if (error) {
            console.error("Erreur lors de la mise à jour du mode sombre :", error.message);
          } else {
            console.log("Success", data);
          }
        });
    }
  }, [user.darkMode, user.session]);

  //this function is to log out from the application
  const Hlogout = async () => {
    await supabase.auth.signOut();
    setUser({
      session: null,
      user: null,
      gravatar: null,
      darkMode: false,
    });
  };

  //this function is to toggle the mode 
  const toggleDarkMode = () => {
    setUser((prevUser) => ({
      ...prevUser,
      darkMode: !prevUser.darkMode,
    }));
  };

  const value = {
    ...user,
    Hlogout,
    toggleDarkMode,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
