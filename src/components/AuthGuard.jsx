import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthService } from '../services/authService';

function AuthGuard({ children }) {
  const [authenticated, setAuthenticated] = useState(null);

  useEffect(() => {
    const check = async () => {
      const isAuth = await AuthService.checkSession();
      setAuthenticated(isAuth);
    };

    check();
  }, []);

  if (authenticated === null) {
    return <div className="text-center mt-5">Vérification de session...</div>;
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default AuthGuard;
