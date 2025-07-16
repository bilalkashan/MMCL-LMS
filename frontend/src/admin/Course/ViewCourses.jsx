import React, { useEffect, useState } from 'react';
import api from '../../api';
import styles from './ViewCourses.module.css';

const ViewCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/course/courses').then(res => {
      if (res.data.success) setCourses(res.data.courses);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className={styles.container}>
      <h2>All Courses</h2>
      {loading ? (
        <p>Loading...</p>
      ) : courses.length === 0 ? (
        <p>No courses uploaded</p>
      ) : (
        courses.map(course => (
          <div key={course._id} className={styles.courseCard}>
            <h3>{course.title} <small>({course.category})</small></h3>
            <p>{course.description}</p>
            <p><strong>Enrolled Employees:</strong> {course.enrolledEmployees.length}</p>
            <div className={styles.enrolledList}>
              {course.enrolledEmployees.length === 0 && <p>No employees enrolled yet</p>}
              {course.enrolledEmployees.map(e => (
                <div key={e.employeeId?._id} className={styles.employee}>
                  <p>Name: {e.employeeId?.name || 'N/A'}</p>
                  <p>Email: {e.employeeId?.email || 'N/A'}</p>
                  <p>Status: {e.status}</p>
                  {e.status === 'completed' && (
                    <>
                      <p>Quiz Score: {e.quizScore}</p>
                      <p>Completed At: {new Date(e.completedAt).toLocaleDateString()}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ViewCourses;
