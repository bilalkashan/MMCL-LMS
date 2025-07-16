import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../../toast';
import '../../verifiedOtp/verifiedOtp.css';
import Futtor from '../futtor/futtor';
import Taskbar from '../taskbar/taskbar';
import EmailForm from './emailForm';
import OtpForm from './otpForm';
import PasswordResetForm from './passwordForm'; 
import { useNavigate } from 'react-router-dom';

const ForgetPassword = () => {
    const [email, setEmail] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [password, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otpVerified, setOtpVerified] = useState(false);

    const navigate = useNavigate(); 

    const handleChangeEmail = (e) => setEmail(e.target.value);
    const handleChangeOtp = (e) => setOtp(e.target.value);
    const handleChangeNewPassword = (e) => setNewPassword(e.target.value);
    const handleChangeConfirmPassword = (e) => setConfirmPassword(e.target.value);

    const handleSubmitEmail = async (e) => {
        e.preventDefault();
        if (!email) {
            return handleError('Email is required');
        }

        try {
            const url = `http://localhost:8080/auth/forget`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const result = await response.json();
            const { success, message, error } = result;

            if (success) {
                handleSuccess(message);
                setOtpSent(true);
            } else {
                handleError(error?.details?.[0]?.message || message || 'An error occurred');
            }
        } catch (err) {
            handleError(err.message);
        }
    };

    const handleSubmitOtp = async (e) => {
        e.preventDefault();
        if (!otp) {
            return handleError('OTP is required');
        }

        try {
            const url = `http://localhost:8080/auth/verify`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp })
            });
            const result = await response.json();
            const { success, message } = result;

            if (success) {
                handleSuccess(message);
                setOtpVerified(true); 
            } else {
                handleError(message || 'An error occurred');
            }
        } catch (err) {
            handleError(err.message);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
       

        if (password !== confirmPassword) {
            return handleError('Passwords do not match');
        }

        try {
            const url = `http://localhost:8080/auth/resetPassword`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const result = await response.json();
            const { success, message } = result;

            if (success) {
                handleSuccess(message);
                setTimeout(()=>{
                navigate('/login'); 
            },1000)
            } else {
                handleError(message || 'An error occurred');
            }
        } catch (err) {
            handleError(err.message);
        }
    };

    return (
        <>
            <Taskbar />
            <div className='page'>
                <div className='container'>
                    <h1>Forget Password</h1>
                    {!otpSent ? (
                        <EmailForm
                            email={email}
                            onChangeEmail={handleChangeEmail}
                            onSubmitEmail={handleSubmitEmail}
                        />
                    ) : !otpVerified ? (
                        <OtpForm
                            otp={otp}
                            onChangeOtp={handleChangeOtp}
                            onSubmitOtp={handleSubmitOtp}
                        />
                    ) : (
                        <PasswordResetForm
                            newPassword={password}
                            confirmPassword={confirmPassword}
                            onChangeNewPassword={handleChangeNewPassword}
                            onChangeConfirmPassword={handleChangeConfirmPassword}
                            onSubmit={handleChangePassword}
                        />
                    )}
                    <ToastContainer />
                </div>
            </div>
            <Futtor />
        </>
    );
};

export default ForgetPassword;