import React , { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';
import OtpVerificationDialog from './otpVerificationDialog.jsx';
import Button from '@mui/material/Button';
import { signupApi, sendOtpApi, verifyOtpApi } from '../api/eventApi';

function SignUp() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [emailVerified, setEmailVerified] = useState(false);

    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpLoading, setOtpLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(emailVerified === false){
          alert('Please verify your email first');
          return;
        }
        const userData = {firstName, lastName, email, password, confirmPassword};
        const response = await signupApi(userData);
          if (response.status === 200) {
            navigate('/users/login');
          }
          else {
            alert(response.message);
          }
    };

    const handleSendOtp = async () => {
      setOtpLoading(true);
      const response = await sendOtpApi(email);
      if(response.status === 200) {
        setOtpLoading(false);
        setOtpSent(true);
      }
    }
    const verifyEmail = async (email) => {
      setShowOtpModal(true);
      setOtpSent(false);
      setOtp('');
    };
    const handleVerifyOtp = async () => {
      setOtpLoading(true);
      const response = await verifyOtpApi(email, otp);
      setOtpLoading(false);
      if (response.status === 200) {
        setEmailVerified(true);
        setShowOtpModal(false);
      } else {
        alert(response.message);
      }
    }
  return (
    <div className="font-sans">
      <Navbar />
      <div className="flex-grow flex items-center justify-center bg-[#dcdcdc] min-h-screen">
        <div className='bg-white w-150 p-8 rounded shadow'>
          <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className="mb-4">
              <label htmlFor="firstName" className="block text-black mb-2"> First Name </label>
              <input  id="name"  type="text"  className="w-full p-2 border border-gray-300 rounded" required
              placeholder="First Name" value={firstName} onChange={(e)=>setFirstName(e.target.value)} />
            </div>
            <div className="mb-4">
              <label htmlFor="lastName" className="block text-black mb-2"> Last Name </label>
              <input  id="name"  type="text"  className="w-full p-2 border border-gray-300 rounded" required
              placeholder="Last Name" value={lastName} onChange={(e)=>setLastName(e.target.value)} />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-black mb-2"> Email</label>
              <input id="email" type="email" className="w-full p-2 border border-gray-300 rounded" required
              placeholder="you@example.com" value={email} onChange={(e)=>setEmail(e.target.value)}/>
              {!emailVerified ? ( <Button variant="text" color="primary" onClick={() => verifyEmail(email)}>Verify Email</Button>)
               : ( <span className="text-green-500">Email Verified</span>)}
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-black mb-2"> Password</label>
              <input id="password" type="password" className="w-full p-2 border border-gray-300 rounded" required
              placeholder="*********" value={password} onChange={(e)=>setPassword(e.target.value)}/>
            </div>
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-black mb-2"> Confirm Password</label>
              <input id="confirmPassword" type="password" className="w-full p-2 border border-gray-300 rounded" required
              placeholder="*********" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}/>
            </div>
            <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 cursor-pointer"> Sign Up </button>
          </form>
        </div>
      </div>
      <Footer />
      {showOtpModal && (<OtpVerificationDialog open={showOtpModal} onClose={() => setShowOtpModal(false)} email={email}
        otpSent={otpSent} otpLoading={otpLoading} otp={otp}  setOtp={setOtp} handleSendOtp={handleSendOtp} handleVerifyOtp={handleVerifyOtp} />)}
    </div>
  );
}

export default SignUp;