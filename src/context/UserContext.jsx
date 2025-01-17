// src/context/UserContext.jsx
import React, { createContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { query, collection, where, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase/firebaseConfig';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    user: null,
    role: null,
    loading: true,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUserData({ user: null, role: null, loading: false });
      } else {
        // Buscar el rol del usuario en Firestore (igual que hacías en Layout)
        const q = query(
          collection(firestore, 'clientes'),
          where('userId', '==', currentUser.uid)
        );
        const querySnapshot = await getDocs(q);

        let role = null;
        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            role = doc.data().rol;
          });
        }

        setUserData({ user: currentUser, role, loading: false });
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={userData}>
      {children}
    </UserContext.Provider>
  );
};
