import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/utils/supabase';
import { MD5 } from 'crypto-js';

const UserContext = createContext();

export const getGravatarUrl = (email) => {
  const gravatarUrl = `https://www.gravatar.com/avatar/${MD5(email.toLowerCase())}?s=150&d=identicon`;
  return gravatarUrl;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    session: null,
    user: null,
    gravatar: null,
    darkMode: null,

  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        // Récupérer l'utilisateur depuis la table users
        supabase
          .from('users')
          .select('darkMode')  // Remplacez 'darkMode' par le nom de la colonne correspondante dans votre table
          .eq('id', session.user.id)
          .then(({ data, error }) => {
            if (error) {
              console.error('Erreur lors de la récupération du mode sombre :', error.message);
            } else {
              const darkMode = data?.[0]?.darkMode ?? false;  // Utiliser la valeur de la base de données ou false par défaut
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

  const Hlogout = async () => {
    await supabase.auth.signOut();
    setUser({
      session: null,
      user: null,
      gravatar: null,
      darkMode: false,
    });
  };

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
