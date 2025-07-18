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
  const [selectedCourse, setSelectedCourse] = useState(null);

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

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
  };

  const handleDeleteEnrollment = async (courseId, employeeId) => {
    try {
      await api.delete(`/courses/${courseId}/unenroll/${employeeId}`);
      setCourses(prevCourses =>
        prevCourses.map(course =>
          course._id === courseId
            ? {
              ...course,
              enrolledEmployees: course.enrolledEmployees.filter(e => e.employeeId?._id !== employeeId)
            }
            : course
        )
      );
    } catch (error) {
      console.error("Error deleting enrollment:", error);
    }
  };

  return (

    <>
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
            {loading ? (
              <p>Loading...</p>
            ) : courses.length === 0 ? (
              <p>No courses uploaded</p>
            ) : (
              <div className={styles.coursesGrid}>
                {courses.map(course => (
                  <div
                    key={course._id}
                    className={styles.courseCard}
                    onClick={() => handleCourseClick(course)}
                  >
                    <h3>{course.title} <small>({course.category})</small></h3>
                    <p>{course.description}</p>
                    <p><strong>Enrolled Employees:</strong> {course.enrolledEmployees.length}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedCourse && (
            <div className={styles.enrollmentDetails}>
              <h2 className={styles.tableHeading}>
                {selectedCourse.title} - Enrolled Employees
              </h2>

              {selectedCourse.enrolledEmployees.length === 0 ? (
                <p>No employees enrolled</p>
              ) : (
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Department</th>
                      <th>Designation</th>
                      <th>Status</th>
                      <th>Progress</th>
                      <th>Quiz Marks</th>
                      <th>Certificate</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCourse.enrolledEmployees.map((emp, index) => (
                      <tr key={index}>
                        <td>{emp.employeeId?.name || "N/A"}</td>
                        <td>{emp.employeeId?.department || "N/A"}</td>
                        <td>{emp.employeeId?.designation || "N/A"}</td>
                        <td>{emp.status}</td>
                        <td>
                          {emp.status === 'completed' ? '100%' : 'In Progress'}
                        </td>
                        <td>{emp.quizScore ?? 'N/A'}</td>
                        <td>
                          {emp.status === 'completed' ? (
                            <a
                              href={`/certificates/${emp.employeeId?._id}/${selectedCourse._id}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              View
                            </a>
                          ) : 'Not issued'}
                        </td>
                        <td>
                          <button
                            className={styles.deleteBtn}
                            onClick={() => handleDeleteEnrollment(selectedCourse._id, emp.employeeId?._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

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


// import React, { useEffect, useState } from 'react';
// import api from '../../api';
// import styles from './ViewCourses.module.css';
// import ProfileHeader from '../../Component/ProfileHeader/profileHeader';
// import Sidebar from '../sidebar/sidebar';
// import { useNavigate } from 'react-router-dom';
// import CourseCards from '../CourseCard/CourseCards';
// import AddCourse from './AddCourse';

// const ViewCourses = () => {
  

//   const navigate = useNavigate();

//   useEffect(() => {
//     api.get('/courses')
//       .then(res => {
//         if (res.data.success) setCourses(res.data.courses);
//         setLoading(false);
//       })
//       .catch(() => setLoading(false));
//   }, []);

//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem("loggedInUser"));
//     if (user?.role) setRole(user.role);
//   }, []);

//   const handleAddClick = () => setShowModal(true);
//   const handleCloseModal = () => setShowModal(false);



//   return (
//     <div className={styles.adminDashboardContainer}>
//       <div className={styles.sidebarContainer}>
//         <Sidebar />
//       </div>

//       <main className={styles.mainContent}>
//         <div className={styles.profileHeaderContainer}>
//           <ProfileHeader />
//         </div>

//         {activeComponent === "dashboard" && (
//           <CourseCards
//             role={role}
//             onCardClick={() => navigate("/request-users")}
//             onCardClick1={() => navigate("/noticeboard")}
//             onCardClick01={() => navigate("/teacherDashboard")}
//             onCardClick02={() => navigate("/teacherslot")}
//             onCardClick03={() => navigate("/slotRequests")}
//           />
//         )}



//         <button className={styles.fab} onClick={handleAddClick}>+</button>

//         {showModal && (
//           <AddCourse onClose={handleCloseModal} />
//         )}
//       </main>
//     </div>
//   );
// };



