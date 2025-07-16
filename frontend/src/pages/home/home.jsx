import React from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Taskbar from "../taskbar/taskbar";
// import Futtor from "../futtor/futtor";
import styles from "./home.module.css";
import mmcImage from "./parallax/landing_page_image.png";
import { IoArrowRedoSharp } from "react-icons/io5";

function Home() {
  const navigate = useNavigate();

  return (
    <>
      <Taskbar />
      <div className={styles.heroSection}>
        <div className={styles.overlay}></div>
        <div className={styles.heroContent}>
          <div className={styles.leftSection}>
            <h1 className={styles.title}>Welcome to MasterMind</h1>
            <p className={styles.description}>
              Empower yourself with <strong>MasterMind</strong>, the ultimate learning platform by Master Motors. Sharpen your skills, expand your knowledge, and drive your career forward.
            </p>
            <ul className={styles.features}>
              <li>📚 Explore interactive courses</li>
              <li>📈 Track your progress</li>
              <li>🤝 Collaborate with teams</li>
              <li>🚀 Unlock your potential</li>
            </ul>
            <button className={styles.loginButton} onClick={() => navigate("/login")}>
              <IoArrowRedoSharp className={styles.arrowIcon}/> Go to Login
            </button>
          </div>
          <div className={styles.rightSection}>
            <img src={mmcImage} alt="MMCL LMS" className={styles.animatedImage} />

          </div>
        </div>
      </div>

      <ToastContainer />
      {/* <Futtor /> */}
    </>
  );
}

export default Home;
