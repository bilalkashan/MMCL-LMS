import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleSuccess, handleError } from "../../toast";
import styles from "./login.module.css";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";

function Login({ toggle }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;

    if (!email || !password) {
      return handleError("Email and password are required");
    }

    try {
      const url =
        process.env.REACT_APP_API_URL || "http://localhost:8080/auth/login";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginInfo),
      });

      const result = await response.json();

      if (result.success) {
        handleSuccess(result.message);
        const userRole = result.user?.role?.toLowerCase().trim();

        const userData = {
          name: result.user?.name,
          email: result.user?.email,
          role: userRole,
          success: result.success,
        };

        localStorage.setItem("token", result.jwtToken);
        localStorage.setItem("role", userRole);
        localStorage.setItem("loggedInUser", JSON.stringify(userData));
        localStorage.setItem("userId", result.user._id);

        setTimeout(() => {
          if (userRole === "admin") {
            navigate("/adminDashboard");
          } else if (userRole === "user") {
            navigate("/userdashboard");
          } else {
            handleError(`Unknown role received: ${userRole}`);
          }
        }, 1000);
      } else {
        handleError(result.error || result.message);
      }
    } catch (err) {
      handleError("Network error. Please try again.");
    }
  };

  return (
    <>
      <div className={styles.loginContainer}>
        {/* Left Side */}
        <div className={styles.leftPanel}>
          <div className={styles.leftContent}>
            <div className={styles.imageWrapper}>
              <img src="/images/MM Logo.png" alt="Login visual" className={styles.loginImage} />
            </div>
            <h1 className={styles.titleHeading}>WELCOME TO MASTERMIND</h1>
            <p className={styles.subtitle}>Don't have an account? Sign Up now</p>
            <Link to="/signup" className={styles.signinButton} onClick={toggle}>SIGN UP</Link>
            {/* <button className={styles.signinButton} >SIGN UP</button> */}
          </div>
        </div>

        {/* Right Side */}
        <div className={styles.rightPanel}>
          <div className={styles.formWrapper}>
            <div className={styles.formHeader}>
              <div className={styles.formTitleSection}>
                <h3 className={styles.formTitle}>Sign In</h3>
                {/* <img src="/images/MMC-Logo.png" alt="Login visual" className={styles.smallImage} /> */}
              </div>
            </div>
            <p className={styles.formSubtitle}>Please provide your information</p>
            <form onSubmit={handleLogin}>
              <div className={styles.formGroup}>
                <input
                  className={styles.formInput}
                  autoFocus
                  type="email"
                  name="email"
                  placeholder="Enter your email..."
                  value={loginInfo.email}
                  onChange={handleChange}
                />
              </div>

              <div style={{ position: "relative", width: "100%" }}>
                <input
                  className={styles.formInput}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password..."
                  value={loginInfo.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  style={{
                    position: "absolute",
                    right: 0,
                    paddingLeft:"5px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#666",
                  }}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>

              <div className={styles.formGroup}>
                <button type="submit" className={styles.submitButton}>Log In</button>
              </div>

              <div className={styles.mobileLoginlink}>
                <p>
                  Don't have an account?
                  <Link to="/signup" className={styles.linkText}>Sign Up</Link>
                </p>
              </div>
            </form>




          </div>
        </div>
      </div>
      <ToastContainer />
      {/* <Futtor /> */}
    </>
  );
}

export default Login;
