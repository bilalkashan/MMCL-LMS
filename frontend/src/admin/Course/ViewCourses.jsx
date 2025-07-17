import React, { useEffect, useState } from 'react';
import api from '../../api';
import styles from './ViewCourses.module.css';
import ProfileHeader from '../../Component/ProfileHeader/profileHeader';
import Sidebar from '../sidebar/sidebar';
import { useNavigate } from 'react-router-dom';
import CourseCards from '../CourseCard/CourseCards';
import AddCourse from './AddCourse';

const ViewCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const [activeComponent, setActiveComponent] = useState("dashboard");
  const [showModal, setShowModal] = useState(false);
  const [addCourses, setAddCourses] = useState([]);

  useEffect(() => {
    api.get('/courses').then(res => {
      if (res.data.success) setCourses(res.data.courses);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (user && user.role) {
      setRole(user.role);
    }
  }, []);

  const handleAddClick = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleCourseAdded = (newCourse) => {
        setAddCourses((prevCourses) => [...prevCourses, newCourse]);
    };


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

    <>
      {/* <div className={styles.container}>
        
      </div> */}
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
              <CourseCards
                role={role}
                onCardClick={() => handleCardClick("requestUsers")}
                onCardClick1={() => handleCardClick("announcements")}
                onCardClick01={() => handleCardClick("/teacherDashboard")}
                onCardClick02={() => handleCardClick("/teacherslot")}
                onCardClick03={() => handleCardClick("/slotRequests")}
              />
            </>
          )}

          <div>

            {/* <h2>All Courses</h2> */}
            {loading ? (
              <p>Loading...</p>
            ) : courses.length === 0 ? (
              <p>No courses uploaded</p>
            ) : (
              <div className={styles.coursesGrid}>
                {courses.map(course => (
                  <div key={course._id} className={styles.courseCard}>
                    <h3>{course.title} <small>({course.category})</small></h3>
                    <p>{course.description}</p>
                    <p><strong>Enrolled Employees:</strong> {course.enrolledEmployees.length}</p>
                    <div className={styles.enrolledList}>
                      {course.enrolledEmployees.length === 0 && <p>No employees enrolled yet</p>}
                      {course.enrolledEmployees.map(e => (
                        <div key={e.employeeId?._id} className={styles.employee}>
                          <p>Name: {e.employeeId?.name || 'N/A'}</p>
                          {/* <p>Email: {e.employeeId?.email || 'N/A'}</p> */}
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
                ))}
              </div>
            )}
          </div>
        </main>

        <button className={styles.fab} onClick={handleAddClick}>
          +
        </button>

        {showModal && (
          <AddCourse onClose={handleCloseModal} onAdviserAdded={handleCourseAdded} />
        )}

      </div>

    </>


  );
};

export default ViewCourses;
