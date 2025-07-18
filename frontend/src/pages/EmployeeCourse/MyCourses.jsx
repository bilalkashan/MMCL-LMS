// MyCourses.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import styles from './MyCourses.module.css';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/myCourses');
        setCourses(res.data.courses);
      } catch (err) {
        console.error('Error loading courses:', err);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className={styles.myCoursesContainer}>
      <h2 className={styles.title}>My Enrolled Courses</h2>
      <div className={styles.courseGrid}>
        {courses.map(course => (
          <Link to={`/myCourses/${course._id}`} key={course._id} className={styles.courseCard}>
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <p><strong>Status:</strong> {course.status}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MyCourses;
