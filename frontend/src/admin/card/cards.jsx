import React, { useEffect, useState } from 'react';
import Card from './card';
import styles from './card.module.css';
import api from '../../api';

const Cards = ({
  onCardClick, onCardClick1, onCardClick2, onCardClick3, onCardClick4,
  onCardClick01, onCardClick02, onCardClick03,
  role
}) => {
  const [users, setUsers] = useState([]);
  const [enrolledTotal, setEnrolledTotal] = useState(0);



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
    if (role === 'user') {
      api.post('/totalEnrolledCourses')
        .then(res => {
          if (res.data && typeof res.data.total === "number") {
            setEnrolledTotal(res.data.total);
          } else {
            setEnrolledTotal(0);
          }
        })
        .catch(err => {
          console.error("Error fetching enrolled courses:", err);
          setEnrolledTotal(0);
        });
    }
  }, [role]);

  return (
    <div className={styles.cardsWrapper}>
      <div className={styles.statsCardsWrapper}>

        {role === 'user' && (
          <>
            {/* <Card
              value={Array.isArray(users) ? users.length : 0}
              title="Total Enrolled Courses"
              cardClass={styles.cardPrimaryContainer}
              onClick={onCardClick}
            /> */}

            <Card
              value={enrolledTotal}
              title="Total Enrolled Courses"
              cardClass={styles.cardPrimaryContainer}
              onClick={onCardClick}
            />

            <Card
              value={enrolledTotal}
              title="Incomplete Courses"
              cardClass={styles.cardSuccessContainer}
              onClick={onCardClick1}
            />
            <Card
              value={enrolledTotal}
              title="Completed Courses"
              cardClass={styles.cardWarningContainer}
              onClick={onCardClick2}
            />
            <Card
              value={enrolledTotal}
              title="In Progress Course"
              cardClass={styles.cardInfoContainer}
              onClick={onCardClick3}
            />
          </>
        )}

        {role === 'admin' && (
          <>
            <Card
              value={Array.isArray(users) ? users.length : 0}
              title="Total Users"
              description="More info"
              cardClass={styles.cardPrimaryContainer}
              onClick={onCardClick}
            />
            <Card
              value={Array.isArray(users) ? users.length : 0}
              title="Total Active Users"
              description="More info"
              cardClass={styles.cardSuccessContainer}
              onClick={onCardClick1}
            />
            <Card
              value={Array.isArray(users) ? users.length : 0}
              title="Verified Users"
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
        )}
      </div>
    </div>
  );
};

export default Cards;