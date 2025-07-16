import React, { useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../toast';
import "./verifiedOtp.css";
import { useLocation } from 'react-router-dom';
import Futtor from '../pages/futtor/futtor';
import Taskbar from '../pages/taskbar/taskbar';

function VerifiedOtp() {
    const [OtpModel, setOtpModel] = useState({
        otp: '', 
    });

    const location = useLocation();
    const email = location.state?.email;

    console.log(email);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setOtpModel(prevOtpModel => ({ ...prevOtpModel, [name]: value }));
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        const { otp } = OtpModel;
        
        if (!otp) {
            return handleError('OTP is required');
        }
      
        try {
            const url = `http://localhost:8080/auth/verify`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, otp }) 
            });
            const result = await response.json();

            console.log(result);
            const { success, message, error } = result;
            if (success) {
                handleSuccess(message);
                setTimeout(() => {
                    navigate('/login');
                }, 1000);
            } else if (error) {
                const details = error?.details[0]?.message || 'An error occurred';
                handleError(details);
            } else if (!success) {
                handleError(message);
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
                    <h1>Verification OTP</h1>
                    <form onSubmit={handleSignup}>
                        <div>
                            <input
                                onChange={handleChange}
                                type='text'
                                name='otp'
                                autoFocus
                                placeholder='* * * * * *'
                                value={OtpModel.otp}
                                className="inputField"
                            />
                        </div>

                        <button type='submit' className='loginButton'>Verify</button>
                    </form>
                    <ToastContainer />
                </div>
            </div>
            <Futtor />
        </>
    );
}

export default VerifiedOtp;