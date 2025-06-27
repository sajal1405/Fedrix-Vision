// src/pages/auth/AuthCallbackHandler.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../utils/supabase';

const AuthCallbackHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Handle the magic link and redirect
    const handleMagicLink = async () => {
      const { error } = await supabase.auth.getSession();
      // Optionally, force refresh user session
      if (!error) {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/login?error=invalid-or-expired-link', { replace: true });
      }
    };
    handleMagicLink();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-white">
      <div className="animate-spin border-4 border-teal-500 rounded-full h-12 w-12 mb-6"></div>
      <p>Signing you in…</p>
    </div>
  );
};
export default AuthCallbackHandler;
