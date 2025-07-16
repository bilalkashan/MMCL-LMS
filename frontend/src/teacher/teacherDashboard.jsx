import React, { useEffect, useState } from 'react';
import styles from './teacherDashboard.module.css';
import Sidebar from "../admin/sidebar/sidebar";
import api from '../../api';

const TeacherDashboard = () => {
  const [fyps, setFyps] = useState([]);

  useEffect(() => {
    const fetchFyps = async () => {
      try {
        const response = await api.get('/fyp/get-all'); // API to fetch all FYPs
        setFyps(response.data.data);  // Store FYP submissions in state
      } catch (error) {
        console.error("Error fetching FYPs:", error);
      }
    };

    fetchFyps();
  }, []);

  const handleApproval = async (fypId, status) => {
    try {
      const response = await api.put('/fyp/approve-reject-fyp', { fypId, status });
      alert(response.data.message);  // Show success message
      // Re-fetch FYPs after approval/rejection
      const updatedFyps = await api.get('/fyp/get-all');
      setFyps(updatedFyps.data.data);
    } catch (error) {
      console.error("Error approving/rejecting FYP:", error);
    }
  };

  return (
    <div className={styles.adminDashboardContainer}>
      <Sidebar />
      <main className={styles.mainContent}>
        <header className={styles.dashboardHeader}>
          <h1>Teacher Dashboard</h1>
          <nav>
            <a href="#home">Home</a> / <a href="#dashboard">Dashboard</a>
          </nav>
        </header>

        <section className={styles.fypList}>
          <h2>Submitted FYPs</h2>
          <div className={styles.fypContainer}>
            {fyps.length > 0 ? (
              fyps.map(fyp => (
                <div key={fyp._id} className={styles.fypCard}>
                  <h3>{fyp.title}</h3>
                  <p><strong>Group Members:</strong> {fyp.groupMembers.join(', ')}</p>
                  <p>{fyp.description}</p>
                  <div className={styles.actions}>
                    <button onClick={() => handleApproval(fyp._id, 'approved')}>Approve</button>
                    <button onClick={() => handleApproval(fyp._id, 'rejected')}>Reject</button>
                  </div>
                </div>
              ))
            ) : (
              <p>No FYPs submitted for approval.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default TeacherDashboard;
