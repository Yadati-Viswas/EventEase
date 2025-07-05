import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../../contexts/AuthContext';
import Navbar from '../Navbar';
import Footer from '../Footer';
import {Link} from 'react-router-dom';
import {loginApi, postGoogleApi} from '../api/eventApi';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const {login} = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = {email, password};
        const response = await loginApi(userData);
        if (response.status === 200) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.data));
          login(response.data.data);
          navigate('/');
        } else {
          alert(response.message);
        }
    };
    const handleGoogleSuccess = async (credentialResponse) => {
      const response = await postGoogleApi(credentialResponse.credential);
      if (response.status === 200) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data));
        login(response.data.data);
        navigate('/');
      } else {
        alert(response.message);
      }
    //alert('Google login successful! Token: ' + credentialResponse.credential);
  };

  // Google login error handler
  const handleGoogleError = () => {
    alert('Google login failed');
  };
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center bg-[#dcdcdc]">
        <div className="w-full max-w-md bg-white p-8 rounded shadow">
          <h2 className="text-2xl font-bold mb-6 text-black text-center">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-black mb-2"> Email </label>
              <input id="email" type="email" className="w-full p-2 border border-gray-300 rounded" 
              placeholder="you@example.com" value={email} onChange={(e)=>setEmail(e.target.value)}/>
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-black mb-2"> Password </label>
              <input id="password" type="password" className="w-full p-2 border border-gray-300 rounded" 
              placeholder="********" value={password} onChange={(e)=>setPassword(e.target.value)} />
            </div>
            <div className="flex justify-between items-center mb-4">
                <Link to="/users/signup" className="text-blue">Create Account</Link>
                <Link to="/users/password-reset" className="text-blue">Forgot Password?</Link>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 cursor-pointer"> Login </button>
          </form>
          <div className="mt-4 mb-4 flex flex-col bg-gray-900 gap-2">
            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
              <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} width="100%"/>
            </GoogleOAuthProvider>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Login;