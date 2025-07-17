import React, { useState, useEffect } from "react";
import styles from "./sidebar.module.css";
import { useNavigate, Link } from "react-router-dom";
// import LogoImg from "./MMC-Logo.png";
import LogoImg from "./MM Logo.png";
// import LogoImg from "./mmc-logo copy.png";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (user) {
      setRole(user.role);
      setName(user.name);
    }
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      <button
        className={`${styles.hamburger} ${isOpen ? styles.open : ""}`}
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        <div></div>
        <div></div>
        <div></div>
      </button>

      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        <img src={LogoImg} alt="" className={styles.logoImg} />
        {/* <div className={styles.sidebarHeader}>
          {role.charAt(0).toUpperCase() + role.slice(1)} Panel
        </div> */}
        <div className={styles.userInfo}>{name}</div>

        {/* Admin Routes */}
        {role === "admin" && (
          <>
            <Link to="/adminDashboard" className={styles.menuItem}>
              Dashboard
            </Link>
            {/* <Link to="/request-users" className={styles.menuItem}>
              Request Users
            </Link> */}
            {/* <Link to="/adviserslist" className={styles.menuItem}>
              Enrolled Courses
            </Link> */}
            <Link to="/noticeboard" className={styles.menuItem}>
              Notice Board
            </Link>
            <Link to="/admin/add-course" className={styles.menuItem}>
              Add Courses
            </Link>
            <Link to="/admin/view-courses" className={styles.menuItem}>
              Uploaded Course
            </Link>
            {/* <Link to="/dataset" className={styles.menuItem}>
              Certificates
            </Link> */}
            {/* <button onClick={handleLogout} className={styles.menuItem}>
              Logout
            </button> */}
          </>
        )}


        {/* Employee Routes */}
        {role === "user" && (
          <>
            <Link to="/userDashboard" className={styles.menuItem}>
              Dashboard
            </Link>
            <Link to="/noticeboard" className={styles.menuItem}>
              Noticeboard
            </Link>
            <Link to="/courses" className={styles.menuItem}>
              Available Courses
            </Link>
            <Link to="/myCourses" className={styles.menuItem}>
              My Courses
            </Link>
            <Link to="/certificates" className={styles.menuItem}>
              Certificates
            </Link>
            
            {/* <Link to="/projectIdea" className={styles.menuItem}>
              Open Idea
            </Link>
            <Link to="/result" className={styles.menuItem}>
              Result
            </Link> */}

          </>
        )}


        {/* Teacher Routes
        {role === "teacher" && (
          <>
            <Link to="/teacherDashboard" className={styles.menuItem}>
              Dashboard
            </Link>
            <Link to="/teacherslot" className={styles.menuItem}>
              My Slots
            </Link>
            <Link to="/slotRequests" className={styles.menuItem}>
              Slot Requests
            </Link>
            <Link to="/submittedfyp" className={styles.menuItem}>
              Submitted FYP
            </Link>
            <button onClick={handleLogout} className={styles.menuItem}>
              Logout
            </button>
          </>
        )} */}

        {/* <div className={styles.logoutContainer}>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div> */}
        <button onClick={handleLogout} className={styles.menuItem}>
          Logout
        </button>
      </aside>

      {isOpen && <div className={styles.overlay} onClick={toggleSidebar}></div>}
    </>
  );
};

export default Sidebar;
