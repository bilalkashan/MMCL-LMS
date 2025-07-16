import React, { useEffect, useState } from 'react';
import api from '../../api';
import styles from './AvailableCourses.module.css';

const AvailableCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    api.get('/course/courses').then(res => {
      if(res.data.success) setCourses(res.data.courses);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleEnroll = async (courseId) => {
    setMessage(null);
    try {
      const res = await api.post(`/course/enroll/${courseId}`);
      if(res.data.success) setMessage('Enrolled successfully!');
      else setMessage(res.data.message || 'Failed to enroll');
    } catch {
      setMessage('Server error');
    }
  };

  return (
    <div className={styles.container}>
      <h2>Available Courses</h2>
      {message && <p>{message}</p>}
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
  );
};

export default AvailableCourses;
