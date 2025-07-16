import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./taskbar.module.css";

function Taskbar() {
  const [userData, setUserData] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserData = localStorage.getItem("loggedInUser");
    const parsedUserData = JSON.parse(storedUserData);
    setUserData(parsedUserData);
  }, [navigate]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo}>
        <img src="/images/MMC-Logo.png" alt="Logo" className={styles.LogoImg} />
      </Link>

      {userData && <div className={styles.namebox}>{userData.name}</div>}

      <div className={styles.menuIcon} onClick={toggleMenu}>
        <div
          className={`${styles.line} ${menuOpen ? styles.activeLine1 : ""}`}
        />
        <div
          className={`${styles.line} ${menuOpen ? styles.activeLine2 : ""}`}
        />
        <div
          className={`${styles.line} ${menuOpen ? styles.activeLine3 : ""}`}
        />
      </div>

      <ul
        className={`${styles.navMenu} ${menuOpen ? styles.navMenuActive : ""}`}
      >
        {/* Only show these links if user is logged in */}
        {userData && (
          <>
            <li className={styles.navItem}>
              <Link to="/userdashboard" className={styles.link}>
                Dashboard
              </Link>
            </li>

            {/* Advisor Dropdown */}
            <li className={`${styles.navItem} ${styles.dropdown}`}>
              <div className={styles.link}>Advisor ▾</div>
              <ul className={styles.dropdownMenu}>
                <li className={styles.dropdownItem}>
                  <Link to="/adviserAvailibilty" className={styles.droplink}>
                    Advisor Availability
                  </Link>
                </li>
                <li className={styles.dropdownItem}>
                  <Link to="/advisordetails" className={styles.droplink}>
                    Advisor Details
                  </Link>
                </li>
              </ul>
            </li>

            {/* FYP Dropdown */}
            <li className={`${styles.navItem} ${styles.dropdown}`}>
              <div className={styles.link}>FYP ▾</div>

              <ul className={styles.dropdownMenu}>
                <li className={styles.dropdownItem}>
                  <Link to="/fypresult" className={styles.droplink}>
                    FYP Result
                  </Link>
                </li>

                <li className={styles.dropdownItem}>
                  <Link to="/uploadFYP" className={styles.droplink}>
                    Upload FYP
                  </Link>
                </li>
              </ul>
            </li> 

            <li className={`${styles.navItem} ${styles.dropdown}`}>
              <div className={styles.link}>Profile ▾</div>

              <ul className={styles.dropdownMenu}>
                <li className={styles.dropdownItem}>
                  <Link to="/resource-file" className={styles.droplink}>
                    Edit Profile
                  </Link>
                </li>

                <li className={styles.dropdownItem}>
                  <Link to="/dataset" className={styles.droplink}>
                    Update Password 
                  </Link>
                </li>
              </ul>
            </li>

            <li className={styles.navItem}>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                Log Out
              </button>
            </li>
          </>
        )}

        {/* If the user is logged out, only show "About" */}
         {!userData && (
          <li className={styles.navItem}>
            <Link to="/about" className={styles.link}>
              Home
            </Link>

            <Link to="/about" className={styles.link}>
              Contact Us
            </Link>
          </li>
        )} 
      </ul>
    </nav>
  );
}

export default Taskbar;
