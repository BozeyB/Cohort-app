import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged, getAuth } from 'firebase/auth';

const auth = getAuth();

function PrivateRoute({ children }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
    });
    return unsub;
  }, []);

  if (user === undefined) {
    return <div className="text-center mt-8 text-gray-500">Checking login...</div>;
  }

  return user ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
