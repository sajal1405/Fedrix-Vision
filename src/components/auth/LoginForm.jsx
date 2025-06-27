import React, {
  useRef,
  useState,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import gsap from 'gsap';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../../supabaseClient';
const logo = '/fedrix.svg';
import { AuthContext } from '../../context/AuthContext';
import { UserProfileContext } from '../../context/UserProfileContext';

const LoginForm = () => {
  const sliderRef = useRef(null);
  const knobRef = useRef(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [slidIn, setSlidIn] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const { saveProfile } = useContext(UserProfileContext);

  const handleLogin = useCallback(async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError('Invalid email or password');
      gsap.to(knobRef.current, { x: 0 });
      setSlidIn(false);
      return;
    }

    const { user } = data;
    const metadata = user.user_metadata || {};
    let role = metadata.role || 'client';

    if (user.email === 'sajal@fedrixgroup.com') {
      role = 'superadmin';
    }

    login(role, user.email);

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profile) {
      saveProfile(profile);
    }

    navigate('/dashboard');
  }, [email, password, login, navigate, saveProfile]);

  useEffect(() => {
    const knob = knobRef.current;
    const track = sliderRef.current;
    let isDragging = false;

    const onMove = (e) => {
      if (!isDragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const bounds = track.getBoundingClientRect();
      let x = Math.min(Math.max(0, clientX - bounds.left), bounds.width - 50);
      gsap.to(knob, { x });
      if (x >= bounds.width - 60) {
        isDragging = false;
        setSlidIn(true);
        handleLogin();
      }
    };

    const onDown = () => (isDragging = true);
    const onUp = () => {
      if (!slidIn) gsap.to(knob, { x: 0 });
      isDragging = false;
    };

    knob.addEventListener('mousedown', onDown);
    knob.addEventListener('touchstart', onDown, { passive: true });
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchend', onUp, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchend', onUp);
      knob.removeEventListener('mousedown', onDown);
      knob.removeEventListener('touchstart', onDown);
    };
  }, [slidIn, handleLogin]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative z-10">
      <motion.div
        className="w-full max-w-md bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl rounded-2xl p-8"
        data-aos="zoom-in"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="text-center mb-6">
          <img src={logo} alt="Fedrix Logo" className="h-12 mx-auto" />
          <h2 className="text-white text-xl font-bold mt-4">
            Sign In to Fedrix Vision
          </h2>
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
        )}

        <form
          data-testid="login-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="w-full p-3 mb-4 rounded-md bg-black border border-white/10 text-white"
          />

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="w-full p-3 mb-6 rounded-md bg-black border border-white/10 text-white"
          />

          {/* Slide to login */}
          <div
            ref={sliderRef}
            className="relative w-full h-12 bg-white/10 rounded-full border border-white/10 overflow-hidden select-none"
          >
            <div className="absolute w-full h-full flex items-center justify-center text-sm text-white/60">
              Slide to Login →
            </div>
            <div
              ref={knobRef}
              className="absolute w-12 h-12 top-0 left-0 rounded-full"
              style={{
                background: 'linear-gradient(145deg, #888, #ccc)',
                boxShadow: 'inset 1px 1px 5px #444, inset -1px -1px 5px #000',
              }}
            />
          </div>

        </form>
      </motion.div>
    </div>
  );
};

export default LoginForm;
