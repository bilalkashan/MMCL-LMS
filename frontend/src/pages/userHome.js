import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Taskbar from './taskbar/taskbar';
import Dashboard from './dashboard/dashboard';
import Futtor from './futtor/futtor';

function UsreHome() {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUserData = localStorage.getItem('loggedInUser');
        if (!token || !storedUserData) {
            navigate('/login');
            return;
        }
        const parsedUserData = JSON.parse(storedUserData);
        setUserData(parsedUserData);
    }, [navigate]);

    return (
        <>
        <body>
            <div>
            <Taskbar />
                {userData ? (
                    <div>
                        <Dashboard />
                    </div>
                ) : (
                    <h2>Loading...</h2>
                )}
            </div>
            
            </body>
            <futtor>
            <Futtor />
            </futtor>
        </>
    );
}

export default UsreHome;
