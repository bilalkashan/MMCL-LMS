import React, { useEffect, useState } from 'react';
import api from '../../api';
import styles from './AvailableCourses.module.css';
import Sidebar from '../../admin/sidebar/sidebar';
import ProfileHeader from '../../Component/ProfileHeader/profileHeader';

const AvailableCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    api.get('/courses').then(res => {
      if (res.data.success) setCourses(res.data.courses);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleEnroll = async (courseId) => {
    setMessage(null);
    try {
      const res = await api.post(`/enroll/${courseId}`);
      if (res.data.success) {
        setMessage('Enrolled successfully!');
      }
      else {
        setMessage(res.data.message || 'Failed to enroll');
      }
    } catch {
      setMessage('Already enrolled in this course');
    }
  };

  return (
    <div className={styles.adminDashboardContainer}>
      <div className={styles.sidebarContainer}>
        <Sidebar />
      </div>

      <main className={styles.mainContent}>

        <div className={styles.profileHeaderContainer}>
          <ProfileHeader />
        </div>
{message && <p>{message}</p>}
        <h2 className={styles.availableCourseHead}>Available Courses</h2>
        
        <div className={styles.cardsWrapper}>
          
          <div className={styles.statsCardsWrapper}>
            
            {loading ? (
              <p>Loading...</p>
            ) : courses.length === 0 ? (
              <p>No courses available</p>
            ) : (
              courses.map(course => (
                <div key={course._id} className={styles.courseCard}>
                  <h3>{course.title} <small>({course.category})</small></h3>
                  <p>{course.description}</p>
                  <button onClick={() => handleEnroll(course._id)}>Enroll</button>
                  
                </div>
              ))
            )}
          </div>
        </div>

      </main>

    </div>
  );
};

export default AvailableCourses;
