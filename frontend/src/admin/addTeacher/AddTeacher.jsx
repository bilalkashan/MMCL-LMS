import React, { useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../../toast';
import styles from '../../pages/signup/signup.module.css'; 
import Sidebar from '../sidebar/sidebar';
import style from './addTeacher.module.css'; 
import api from '../../api';

function Signup() {
    const [signupInfo, setSignupInfo] = useState({
        name: '',
        email: '',
        password: '',
        retypePassword: '',
        role: 'teacher' 
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSignupInfo(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        const { name, email, password, retypePassword, role } = signupInfo;

        // === Client-side Validations ===
        if (!name || !email || !password || !retypePassword) {
            return handleError('All fields are required');
        }

        if (name.length < 3) {
            return handleError('Name should contain at least 3 characters');
        }

        const nameRegex = /\d/;
        if (nameRegex.test(name)) {
            return handleError('Name should not contain numbers');
        }

        if (password !== retypePassword) {
            return handleError('Passwords do not match');
        }

        try {
            const { data } = await api.post('/signup', {
                name,
                email,
                password,
                role
            });

            const { success, message, error } = data;

            if (success) {
                handleSuccess(message);
                setTimeout(() => {
                    navigate('/verifiedotp', { state: { email } });
                }, 1000);
            } else {
                handleError(error?.details?.[0]?.message || message);
            }

        } catch (err) {
            handleError(err.response?.data?.message || err.message);
        }
    };

    return (
        <>
            <div className={styles.page}>
                <Sidebar />
                <div className={style.container}>
                    <h1>Teacher Signup</h1>
                    <form onSubmit={handleSignup}>
                        <div>
                            <label htmlFor='name'>Name</label>
                            <input
                                name='name'
                                value={signupInfo.name}
                                onChange={handleChange}
                                autoFocus
                                placeholder='Enter your name...'
                            />
                        </div>
                        <div>
                            <label htmlFor='email'>Email</label>
                            <input
                                name='email'
                                type='email'
                                value={signupInfo.email}
                                onChange={handleChange}
                                placeholder='Enter your email...'
                            />
                        </div>
                        <div>
                            <label htmlFor='password'>Password</label>
                            <input
                                name='password'
                                type='password'
                                value={signupInfo.password}
                                onChange={handleChange}
                                placeholder='Enter your password...'
                            />
                        </div>
                        <div>
                            <label htmlFor='retypePassword'>Retype Password</label>
                            <input
                                name='retypePassword'
                                type='password'
                                value={signupInfo.retypePassword}
                                onChange={handleChange}
                                placeholder='Retype your password...'
                            />
                        </div>
                        <button type='submit'>Signup</button>
                        <span>
                        </span>
                    </form>
                    <ToastContainer />
                </div>
            </div>
        </>
    );
}

export default Signup;