import Navbar from "../Navbar";
import Footer from "../Footer";
import OtpVerificationDialog from "./otpVerificationDialog.jsx";
import Button from '@mui/material/Button';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetPasswordApi, sendOtpApi, verifyOtpApi } from "../api/eventApi";

export default function PasswordReset() {

    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [emailVerified, setEmailVerified] = useState(false);
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpLoading, setOtpLoading] = useState(false);
    const [otpError, setOtpError] = useState('');

    const navigate = useNavigate();

    const handleSendOtp = async () => {
      setOtpLoading(true);
      const purpose = 'password-reset';
      const response = await sendOtpApi(email, purpose);
      if(response.status === 200) {
        setOtpLoading(false);
        setOtpSent(true);
      } else {
        setOtpLoading(false);
        setOtpError(response.message || 'OTP is not valid');
        alert(response.message);
      }
    };
    const verifyEmail = async (email) => {
      setShowOtpModal(true);
      setOtpSent(false);
      setOtp('');
    };
    const handleVerifyOtp = async () => {
        setOtpLoading(true);
        setOtpError('');
        try {
            const response = await verifyOtpApi(email, otp);
            if (response.status === 200) {
                setOtpLoading(false);
                setEmailVerified(true);
                setShowOtpModal(false);
            } else {
                setOtpLoading(false);
                setOtpError(response.message || 'OTP is not valid');
            }
        } catch (error) {
            setOtpLoading(false);
            setOtpError('OTP is not valid');
        }
    };
    const handlePasswordReset = async (e) => {
        e.preventDefault();
        if(!emailVerified) {
            alert("Please verify your email first");
            return;
        }
        if (newPassword !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        const response = await resetPasswordApi(email, newPassword);
        if (response.status === 200) {
            alert("Password reset successful");
            navigate("/users/login");
        } else {
            alert(response.message);
        }
    };
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-grow flex items-center justify-center overflow-scroll bg-[#dcdcdc]">
                <div className="w-150 bg-gray-100 p-8 rounded shadow">
                    <h2 className="text-2xl font-bold mb-6 text-black text-center">Password Reset</h2>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-black mb-2"> Email</label>
                        <input id="email" type="email" className="w-full p-2 border border-gray-300 rounded" required
                        placeholder="you@example.com" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                        {!emailVerified ? ( <Button variant="text" color="primary" onClick={() => verifyEmail(email)}>Verify Email</Button>)
                        : ( <span className="text-green-500">Email Verified</span>)}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="new-password" className="block text-black mb-2"> New Password</label>
                        <input id="new-password" type="password" className="w-full p-2 border border-gray-300 rounded" required
                        placeholder="Enter new password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)}/>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="confirm-password" className="block text-black mb-2"> Confirm Password</label>
                        <input id="confirm-password" type="password" className="w-full p-2 border border-gray-300 rounded" required
                        placeholder="Confirm new password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}/>
                    </div>
                    <div className="flex items-center justify-between">
                        <Button variant="contained" color="primary" onClick={handlePasswordReset}>Reset Password</Button>
                    </div>
                </div>
            </div>
            <Footer />
            {showOtpModal && (<OtpVerificationDialog open={showOtpModal} onClose={() => setShowOtpModal(false)} email={email} otpError={otpError} setOtpError={setOtpError}
            otpSent={otpSent} otpLoading={otpLoading} otp={otp}  setOtp={setOtp} handleSendOtp={handleSendOtp} handleVerifyOtp={handleVerifyOtp} />)}
        </div>
    )
}