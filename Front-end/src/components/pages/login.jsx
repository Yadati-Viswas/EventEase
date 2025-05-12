import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../AuthContext';
import Navbar from '../Navbar';
import Footer from '../Footer';
import {Link} from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const {login} = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = {email, password};
        const response = await axios({
          method: 'POST',
          url: 'http://localhost:3000/users/login',
          data: userData,
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
          timeout: 5000,
        });
        if (response.status === 200) {
          login(response.data.data);
          navigate('/');
        } else {
          alert(response.message);
        }
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
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Login;