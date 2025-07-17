import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from "../sidebar/sidebar";
import Cards from '../card/cards';
import styles from './adminDashboard.module.css';
import EmployeeProgressGraph from '../../Component/EmployeeProgressGraph/EmployeeProgressGraph';
import MonthlyProgressBarChart from '../../Component/MonthlyProgressChart/MonthlyProgressChart';
import ProfileHeader from '../../Component/ProfileHeader/profileHeader';
// import axios from 'axios';

const AdminDashboard = () => {
  const [progress, setProgress] = useState({ completed: 0, in_progress: 0, incomplete: 0 });
  const [activeComponent, setActiveComponent] = useState("dashboard");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (user && user.role) {
      setRole(user.role);
    }
  }, []);

  // useEffect(() => {
  //   const user = JSON.parse(localStorage.getItem("loggedInUser"));
  //   if (user && user._id) {
  //     axios.get(`http://localhost:8080/employee/${user._id}`) 
  //       .then(res => {
  //         const data = res.data;
  //         const formatted = {
  //           completed: 0,
  //           in_progress: 0,
  //           incomplete: 0,
  //         };

  //         data.forEach(item => {
  //           if (item.name === 'Completed') formatted.completed = item.value;
  //           if (item.name === 'In Progress') formatted.in_progress = item.value;
  //           if (item.name === 'Incomplete') formatted.incomplete = item.value;
  //         });

  //         setProgress(formatted);
  //       })
  //       .catch(() => {
  //         setProgress({ completed: 0, in_progress: 0, incomplete: 0 });
  //       });
  //   }
  // }, []);

  useEffect(() => {
    // Hardcoded dummy data
    const dummyData = [
      { name: 'Completed', value: 6 },
      { name: 'In Progress', value: 4 },
      { name: 'Incomplete', value: 2 },
    ];

    const formatted = {
      completed: 0,
      in_progress: 0,
      incomplete: 0,
    };

    dummyData.forEach(item => {
      if (item.name === 'Completed') formatted.completed = item.value;
      if (item.name === 'In Progress') formatted.in_progress = item.value;
      if (item.name === 'Incomplete') formatted.incomplete = item.value;
    });

    setProgress(formatted);
  }, []);

  const handleCardClick = (componentName) => {
    setActiveComponent(componentName);
    switch (componentName) {
      case "requestUsers":
        navigate('/request-users');
        break;
      case "announcements":
        navigate('/noticeboard');
        break;
      case "adviserList":
        navigate('/adviserslist');
        break;
      case "result":
        navigate('/result');
        break;
      case "addTeacher":
        navigate('/addTeacher');
        break;
      case "/teacherDashboard":
        navigate('/teacherDashboard');
        break;
      case "/teacherslot":
        navigate('/teacherslot');
        break;
      case "/slotRequests":
        navigate('/slotRequests');
        break;
      default:
        break;
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

        {activeComponent === "dashboard" && (
          <>
            <Cards
              role={role}
              onCardClick={() => handleCardClick("requestUsers")}
              onCardClick1={() => handleCardClick("announcements")}
              onCardClick01={() => handleCardClick("/teacherDashboard")}
              onCardClick02={() => handleCardClick("/teacherslot")}
              onCardClick03={() => handleCardClick("/slotRequests")}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-start', flexWrap: 'wrap' }}>

              {/* Placeholder for second chart */}
              <div className={styles.graphContainer}>
                {/* Add your second chart component here */}
                {(progress.completed + progress.in_progress + progress.incomplete) > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                    <EmployeeProgressGraph
                      completed={progress.completed}
                      inProgress={progress.in_progress}
                      incomplete={progress.incomplete}
                    />
                    <MonthlyProgressBarChart userId={JSON.parse(localStorage.getItem("loggedInUser"))?._id} />
                  </div>
                ) : (
                  <p style={{ padding: '20px', textAlign: 'center' }}>
                    No progress data available.
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
