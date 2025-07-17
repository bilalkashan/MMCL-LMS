import React, { useEffect, useState } from 'react';
import CourseCard from './CourseCard';
import styles from './CourseCard.module.css';
import api from '../../api';

const CourseCards = ({ onCardClick, onCardClick1, onCardClick2, onCardClick3, role }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (role === 'admin') {
      api.post('/getTotalUsers')
        .then(res => {
          if (res.data && Array.isArray(res.data.users)) {
            setUsers(res.data.users);
          } else {
            setUsers([]);
          }
        })
        .catch(err => {
          console.error("Error fetching users:", err);
          setUsers([]);
        });
    }
  }, [role]);

  useEffect(() => {
    if (role === 'admin') {
      api.post('/getTotalActiveUsers')
        .then(res => {
          if (res.data && Array.isArray(res.data.users)) {
            setUsers(res.data.users);
          } else {
            setUsers([]);
          }
        })
        .catch(err => {
          console.error("Error fetching users:", err);
          setUsers([]);
        });
    }
  }, [role]);

  useEffect(() => {
    if (role === 'admin') {
      api.post('/getTotalVerifiedUsers')
        .then(res => {
          if (res.data && Array.isArray(res.data.users)) {
            setUsers(res.data.users);
          } else {
            setUsers([]);
          }
        })
        .catch(err => {
          console.error("Error fetching users:", err);
          setUsers([]);
        });
    }
  }, [role]);


  return (
    <div className={styles.cardsWrapper}>
      <div className={styles.statsCardsWrapper}>
        {/* {role === 'user' && (
          <>
            <Card
            value={Array.isArray(users) ? users.length : 0}
              title="Total Courses"
              description="More info"
              cardClass={styles.cardPrimaryContainer}
              onClick={onCardClick}
            />
            <Card
              title="Incomplete Courses"
              description="More info"
              cardClass={styles.cardSuccessContainer}
              onClick={onCardClick1}
            />
            <Card
              title="Completed Courses"
              description="More info"
              cardClass={styles.cardWarningContainer}
              onClick={onCardClick2}
            /> 
            <Card
              title="In Progress Course"
              description="More info"
              cardClass={styles.cardInfoContainer}
              onClick={onCardClick3}
            />
          </>
        )} */}

        {role === 'admin' && (
          <>
            <CourseCard
              value={Array.isArray(users) ? users.length : 0}
              title="Total Courses Uploaded"
              // description="More info"
              cardClass={styles.cardPrimaryContainer}
              onClick={onCardClick}
            />
            <CourseCard
              value={Array.isArray(users) ? users.length : 0}
              title="Total Employees Enrolled"
              // description="More info"
              cardClass={styles.cardSuccessContainer}
              onClick={onCardClick1}
            />
            <CourseCard
              value={Array.isArray(users) ? users.length : 0}
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