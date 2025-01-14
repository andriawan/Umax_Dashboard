import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import bgLogin from '../assets/bg-default.svg';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';


const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const response = await fetch(
        `https://umaxdashboard-1-w0775359.deta.app/login/?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
          },
        }
      );
  
      if (response.ok) {
        const responseData = await response.json();
        const token = responseData.token;
        const user = responseData.user;
  
        localStorage.setItem('jwtToken', token);
        localStorage.setItem('user_id', user._id);
        
        console.log(localStorage.getItem('jwtToken'));
        console.log(user); // Tampilkan data pengguna
  
        navigate('/Dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
    

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center">
      <img src={bgLogin} className='absolute -z-10'/>
      <div>
        <img src={logo} alt="logo" className="mx-auto pb-2 w-20" />
      </div>
      <div className="flex flex-col items-center justify-center mt-5 sm:mt-0">
        <form onSubmit={handleSubmit} className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg border-2 ">
          <p className="font-semibold text-base text-[#5473E3] mb-5">Login</p>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            className="w-full h-9 rounded-[10px] pl-5 border border-blue mt-2 focus:outline-none focus:ring-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            className="w-full h-9 rounded-[10px] pl-5 border border-blue mt-2 focus:outline-none focus:ring-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full h-10 rounded-full bg-[#3D5FD9] text-[#F5F7FF] hover:bg-[#2347C5] mt-5"
          >
            SIGN IN
          </button>
          <Link
            to="/register"
            className="mt-3 text-[#5473E3] hover:text-[#2347C5] hover:underline"
          >
            <p className="text-[#5473E3] mb-5">Don't have an account? Sign up</p>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
