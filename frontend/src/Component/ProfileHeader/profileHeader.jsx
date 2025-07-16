import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import styles from './profileHeader.module.css';

const ProfileHeader = () => {
    // const navigate = useNavigate();
    const [role, setRole] = useState("");

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("loggedInUser"));
        if (user && user.role) {
            setRole(user.role);
        }
    }, []);

    return (

        <header className={styles.dashboardHeader}>
            <h1 className={styles.dashboardTitle}>
                {role === "user" ? "Employee Dashboard" : "Admin Dashboard"}
            </h1>
            <div className={styles.searchBarWrapper}>
                <input
                    type="text"
                    placeholder="Search courses, lessons..."
                    className={styles.searchInput}
                />
                <button className={styles.searchBarButton}>
                    🔍
                </button>
            </div>
        </header>

    );
};

export default ProfileHeader;