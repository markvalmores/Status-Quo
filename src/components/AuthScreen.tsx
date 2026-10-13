import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Lock,
  Mail,
  User,
  Calendar,
  CheckCircle2,
  Dices,
  Eye,
  EyeOff
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getRandomName } from '../data/celebrities';
import { ADMIN_USER } from '../services/storageService';
import { generateRandomAiAvatar, generateRandomAiCover } from '../services/characterApiService';
import { UserProfile } from '../types';

interface AuthScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState<'signup' | 'login'>('signup');
  const [showPassword, setShowPassword] = useState(false);

  // Sign Up Form States - Pre-populate with a cool random name for new users!
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [retypeEmail, setRetypeEmail] = useState('');
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [birthMonth, setBirthMonth] = useState('June');
  const [birthDay, setBirthDay] = useState('18');
  const [birthYear, setBirthYear] = useState('2001');
  const [rememberMeSignUp, setRememberMeSignUp] = useState(true);

  // Initialize with a random name on first render (email left completely blank as requested)
  useEffect(() => {
    const random = getRandomName();
    setFirstName(random.first);
    setLastName(random.last);
  }, []);

  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMeLogin, setRememberMeLogin] = useState(true);

  // Error & Status
  const [errorMessage, setErrorMessage] = useState('');

  // Generate random stylish name on demand (email left completely blank)
  const handleGenerateRandomName = () => {
    const random = getRandomName();
    setFirstName(random.first);
    setLastName(random.last);
    setErrorMessage('');
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!firstName.trim() || !lastName.trim()) {
      setErrorMessage('Please provide both your First Name and Last Name.');
      return;
    }

    if (email.trim().toLowerCase() !== retypeEmail.trim().toLowerCase()) {
      setErrorMessage('Email addresses do not match. Please retype carefully.');
      return;
    }

    if (password !== retypePassword) {
      setErrorMessage('Passwords do not match. Please retype carefully.');
      return;
    }

    if (password.length < 4) {
      setErrorMessage('Password must be at least 4 characters long.');
      return;
    }

    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    const username = `${firstName.trim().toLowerCase()}_${lastName.trim().toLowerCase()}${Math.floor(Math.random() * 900 + 100)}`;
    const birthdayStr = `${birthMonth} ${birthDay}, ${birthYear}`;

    const newUser: UserProfile = {
      id: `user_${Date.now()}`,
      email: email.trim().toLowerCase(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      name: fullName,
      username,
      birthday: birthdayStr,
      rememberMe: rememberMeSignUp,
      bio: 'Living life one post at a time on Status Quo! 🚀',
      avatar: generateRandomAiAvatar(username),
      avatarType: 'image',
      cover: generateRandomAiCover(username),
      coverType: 'image',
      followersCount: 150,
      followingCount: 15,
      isVerified: false,
      isAdmin: false,
      isVipSubscriber: false,
      energy: 100, // 100 energy for beginners
      maxEnergy: 100,
      lastDailyClaim: '',
      postsCount: 0,
      badgesEarned: [],
      followsBibleVerse: true
    };

    confetti({ particleCount: 120, spread: 70 });
    onLoginSuccess(newUser);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanEmail = loginEmail.trim().toLowerCase();
    const cleanPassword = loginPassword.trim();

    // Check Master Admin Access securely without revealing credentials anywhere in the UI
    if (cleanEmail === 'mdv4244@gmail.com' && cleanPassword === 'mark4246') {
      confetti({ particleCount: 200, spread: 100 });
      onLoginSuccess(ADMIN_USER);
      return;
    }

    if (!cleanEmail || !cleanPassword) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    // Standard user login
    const usernameStr = cleanEmail.split('@')[0];
    const normalUser: UserProfile = {
      id: `user_${Date.now()}`,
      email: cleanEmail,
      name: usernameStr.replace(/[._]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      username: usernameStr,
      bio: 'Back on the timeline. Let the game begin! 🚀',
      avatar: generateRandomAiAvatar(usernameStr),
      avatarType: 'image',
      cover: generateRandomAiCover(usernameStr),
      coverType: 'image',
      followersCount: 220,
      followingCount: 20,
      isVerified: false,
      isAdmin: false,
      isVipSubscriber: false,
      energy: 100,
      maxEnergy: 100,
      lastDailyClaim: '',
      postsCount: 0,
      badgesEarned: [],
      followsBibleVerse: true,
      rememberMe: rememberMeLogin
    };

    confetti({ particleCount: 90, spread: 60 });
    onLoginSuccess(normalUser);
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1));
  const years = Array.from({ length: 80 }, (_, i) => String(2012 - i));

  return (
    <div className="min-h-screen bg-[#090710] flex items-center justify-center p-3 sm:p-6 selection:bg-[#7c3aed] selection:text-[#facc15]">
      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 w-full max-w-lg bg-[#120c22] border border-[#37245f] rounded-3xl shadow-2xl shadow-purple-950/80 overflow-hidden">
        {/* Top Header Banner */}
        <div className="px-6 py-6 border-b border-[#261845] bg-gradient-to-r from-purple-900/40 via-[#180f2f] to-amber-950/30 text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Celebrity & Superhero Social Game</span>
          </div>

          <h1 className="font-display font-black text-2xl sm:text-3xl tracking-tight bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-200 bg-clip-text text-transparent">
            STATUS QUO
          </h1>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Where Hollywood stars, movie superheroes, anime legends, and waifus react, comment, and follow your posts.
          </p>
        </div>

        {/* Tab Toggle (Sign Up vs Log In) */}
        <div className="grid grid-cols-2 p-1.5 m-5 mb-0 bg-[#0d0718] border border-[#261745] rounded-2xl text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('signup');
              setErrorMessage('');
            }}
            className={`py-2.5 rounded-xl transition cursor-pointer ${
              activeTab === 'signup'
                ? 'bg-yellow-400 text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Create Account (Sign Up)
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setErrorMessage('');
            }}
            className={`py-2.5 rounded-xl transition cursor-pointer ${
              activeTab === 'login'
                ? 'bg-yellow-400 text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Log In
          </button>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mx-5 mt-4 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-medium">
            {errorMessage}
          </div>
        )}

        {/* SIGN UP FORM */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignUp} className="p-5 sm:p-6 space-y-3.5">
            {/* Random Name Generator Shortcut */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-300">Personal Information</span>
              <button
                type="button"
                onClick={handleGenerateRandomName}
                className="text-xs text-yellow-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                title="Roll a new random stylish name"
              >
                <Dices className="w-3.5 h-3.5" />
                <span>Roll Random Name</span>
              </button>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">First Name</label>
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-[#180f2d] border border-[#3b276b] rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-yellow-400"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Last Name</label>
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-[#180f2d] border border-[#3b276b] rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-yellow-400"
                  required
                />
              </div>
            </div>

            {/* Email & Retype Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="you@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#180f2d] border border-[#3b276b] rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-yellow-400 font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Retype Email Address</label>
                <input
                  type="email"
                  placeholder="Repeat email"
                  value={retypeEmail}
                  onChange={(e) => setRetypeEmail(e.target.value)}
                  className="w-full bg-[#180f2d] border border-[#3b276b] rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-yellow-400 font-mono"
                  required
                />
              </div>
            </div>

            {/* Password & Retype Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#180f2d] border border-[#3b276b] rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-yellow-400 font-mono pr-8"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Retype Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Repeat password"
                  value={retypePassword}
                  onChange={(e) => setRetypePassword(e.target.value)}
                  className="w-full bg-[#180f2d] border border-[#3b276b] rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-yellow-400 font-mono"
                  required
                />
              </div>
            </div>

            {/* Birthday Selection */}
            <div>
              <label className="text-[11px] text-zinc-400 block mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-yellow-400" />
                <span>Birthday Info</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                <select
                  value={birthMonth}
                  onChange={(e) => setBirthMonth(e.target.value)}
                  className="bg-[#180f2d] border border-[#3b276b] rounded-xl px-2 py-2 text-xs text-zinc-200 focus:outline-none focus:border-yellow-400"
                >
                  {months.map((m) => (
                    <option key={m} value={m} className="bg-[#120c22]">
                      {m}
                    </option>
                  ))}
                </select>

                <select
                  value={birthDay}
                  onChange={(e) => setBirthDay(e.target.value)}
                  className="bg-[#180f2d] border border-[#3b276b] rounded-xl px-2 py-2 text-xs text-zinc-200 focus:outline-none focus:border-yellow-400"
                >
                  {days.map((d) => (
                    <option key={d} value={d} className="bg-[#120c22]">
                      {d}
                    </option>
                  ))}
                </select>

                <select
                  value={birthYear}
                  onChange={(e) => setBirthYear(e.target.value)}
                  className="bg-[#180f2d] border border-[#3b276b] rounded-xl px-2 py-2 text-xs text-zinc-200 focus:outline-none focus:border-yellow-400"
                >
                  {years.map((y) => (
                    <option key={y} value={y} className="bg-[#120c22]">
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="remember_me_signup"
                checked={rememberMeSignUp}
                onChange={(e) => setRememberMeSignUp(e.target.checked)}
                className="rounded accent-yellow-400 w-4 h-4 cursor-pointer"
              />
              <label htmlFor="remember_me_signup" className="text-xs text-zinc-300 cursor-pointer">
                Remember me on this browser
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 mt-2 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-300 text-black font-extrabold text-sm rounded-xl shadow-lg shadow-yellow-500/20 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Create Account & Join Status Quo</span>
            </button>
          </form>
        )}

        {/* LOG IN FORM */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className="p-5 sm:p-6 space-y-4">
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your registered email..."
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full bg-[#180f2d] border border-[#3b276b] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-100 focus:outline-none focus:border-yellow-400 font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password..."
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-[#180f2d] border border-[#3b276b] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-100 focus:outline-none focus:border-yellow-400 font-mono pr-9"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember_me_login"
                checked={rememberMeLogin}
                onChange={(e) => setRememberMeLogin(e.target.checked)}
                className="rounded accent-yellow-400 w-4 h-4 cursor-pointer"
              />
              <label htmlFor="remember_me_login" className="text-xs text-zinc-300 cursor-pointer">
                Remember me on this browser
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-300 text-black font-extrabold text-sm rounded-xl shadow-lg shadow-yellow-500/20 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Log In & Enter Feed</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
