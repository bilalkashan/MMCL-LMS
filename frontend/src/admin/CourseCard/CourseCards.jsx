import React, { useEffect, useState } from 'react';
import CourseCard from './CourseCard';
import styles from './CourseCard.module.css';
import api from '../../api';

const CourseCards = ({ onCardClick, onCardClick1, onCardClick2, onCardClick3, role }) => {
  const [Courses, setCourses] = useState([]);

  useEffect(() => {
    if (role === 'admin') {
      api.post('/getTotalCourses')
        .then(res => {
          if (res.data && Array.isArray(res.data.Courses)) {
            setCourses(res.data.Courses);
          } else {
            setCourses([]);
          }
        })
        .catch(err => {
          console.error("Error fetching users:", err);
          setCourses([]);
        });
    }
  }, [role]);

  useEffect(() => {
    if (role === 'admin') {
      api.post('/getTotalActiveUsers')
        .then(res => {
          if (res.data && Array.isArray(res.data.Courses)) {
            setCourses(res.data.Courses);
          } else {
            setCourses([]);
          }
        })
        .catch(err => {
          console.error("Error fetching users:", err);
          setCourses([]);
        });
    }
  }, [role]);

  useEffect(() => {
    if (role === 'admin') {
      api.post('/getTotalVerifiedUsers')
        .then(res => {
          if (res.data && Array.isArray(res.data.Courses)) {
            setCourses(res.data.users);
          } else {
            setCourses([]);
          }
        })
        .catch(err => {
          console.error("Error fetching users:", err);
          setCourses([]);
        });
    }
  }, [role]);


  return (
    <div className={styles.cardsWrapper}>
      <div className={styles.statsCardsWrapper}>
        {role === 'admin' && (
          <>
            <CourseCard
              value={Array.isArray(Courses) ? Courses.length : 0}
              title="Total Courses Uploaded"
              // description="More info"
              cardClass={styles.cardPrimaryContainer}
              onClick={onCardClick}
            />
            <CourseCard
              value={Array.isArray(Courses) ? Courses.length : 0}
              title="Total Employees Enrolled"
              // description="More info"
              cardClass={styles.cardSuccessContainer}
              onClick={onCardClick1}
            />
            <CourseCard
              value={Array.isArray(Courses) ? Courses.length : 0}
              title="Verified Users"
              // description="More info"
              cardClass={styles.cardWarningContainer}
              onClick={onCardClick2}
            />
            <CourseCard
              title="In Progress Course"
              description="More info"
              cardClass={styles.cardInfoContainer}
              onClick={onCardClick3}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default CourseCards;