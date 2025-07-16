import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import { handleError, handleSuccess } from "../../toast";
import styles from "../login/login.module.css";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";

function Signup({ toggle }) {

  const [showPassword, setShowPassword] = useState(false);
  const [showretypePassword, setShowRetypePassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleResetPasswordVisibility = () => {
    setShowRetypePassword((prev) => !prev);
  };


  const [signupInfo, setSignupInfo] = useState({
    name: "",
    email: "",
    password: "",
    retypePassword: "",
    role: "user",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupInfo((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password, retypePassword, role } = signupInfo;

    // === Client-side Validations ===
    if (!name || !email || !password || !retypePassword) {
      return handleError("All fields are required");
    }

    if (name.length < 3) {
      return handleError("Name should contain at least 3 characters");
    }

    const nameRegex = /\d/;
    if (nameRegex.test(name)) {
      return handleError("Name should not contain numbers");
    }

    if (password !== retypePassword) {
      return handleError("Passwords do not match");
    }

    try {
      const { data } = await axios.post(
        "http://localhost:8080/auth/signup",
        {
          name,
          email,
          password,
          role,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { success, message, error } = data;

      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/verifiedotp", { state: { email } });
        }, 1000);
      } else {
        handleError(error?.details?.[0]?.message || message);
      }
    } catch (err) {
      handleError(err.response?.data?.message || err.message);
    }
  };

  return (
    <>
      {/* <Taskbar /> */}
      <div className={styles.loginContainer}>
        {/* Left Side */}
        <div className={styles.leftPanel}>
          <div className={styles.leftContent}>
            <div className={styles.imageWrapper}>
              <img src="/images/MM Logo.png" alt="Login visual" className={styles.loginImage} />
            </div>
            <h1 className={styles.titleHeading}>WELCOME TO MASTERMIND</h1>
            <p className={styles.subtitle}>Already have an account? Sign in now</p>
            {/* <button className={styles.signinButton} onClick={toggle}>SIGN IN</button> */}
            <Link to="/login" className={styles.signinButton} onClick={toggle}>SIGN IN</Link>

          </div>
        </div>

        {/* Right Side */}
        <div className={styles.rightPanel}>
          <div className={styles.formWrapper}>
            <div className={styles.formHeader}>
              <div className={styles.formTitleSection}>
                <h3 className={styles.formTitle}>Sign Up</h3>
                {/* <img src="/images/MMC-Logo.png" alt="Login visual" className={styles.smallImage} /> */}
              </div>
            </div>
            <p className={styles.formSubtitle}>Please provide your information</p>
            <form onSubmit={handleSignup}>
              <div className={styles.formGroup}>
                <input
                  name="name"
                  value={signupInfo.name}
                  onChange={handleChange}
                  className={styles.formInput}
                  autoFocus
                  placeholder="Enter your name.."
                />
              </div>
              <div className={styles.formGroup}>
                <input
                  name="email"
                  type="email"
                  value={signupInfo.email}
                  onChange={handleChange}
                  className={styles.formInput}
                  placeholder="Enter your email..."
                />
              </div>

              <div style={{ position: "relative", width: "100%" }}>
                <input
                  className={styles.formInput}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password..."
                  value={signupInfo.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  style={{
                    position: "absolute",
                    right: "15px",
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

              <div style={{ position: "relative", width: "100%" }}>
                <input
                  name="retypePassword"
                  type="password"
                  value={signupInfo.retypePassword}
                  onChange={handleChange}
                  className={styles.formInput}
                  placeholder="Retype your password..."
                />
                <button
                  type="button"
                  onClick={toggleResetPasswordVisibility}
                  style={{
                    position: "absolute",
                    right: "15px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#666",
                  }}
                >
                  {showretypePassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>

              <div className={styles.formGroup}>
                <button type="submit" className={styles.submitButton}>Sign Up</button>
              </div>
              <div className={styles.mobileLoginlink}>
                <p>
                  Already have an account?
                  <Link to="/login" className={styles.linkText}>Sign In</Link>
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

export default Signup;
