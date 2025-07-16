import React, { useState } from 'react';
import Login from '../pages/login/login';
import Signup from '../pages/signup/signup';
import styles from './wrapper.module.css';

export default function LoginSignupWrapper() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className={`${styles.wrapper} ${isSignUp ? styles.rightPanelActive : ''}`}>
      <div className={styles.panelLeft}>
        <Signup toggle={() => setIsSignUp(false)} />
      </div>
      <div className={styles.panelRight}>
        <Login toggle={() => setIsSignUp(true)} />
      </div>
    </div>
  );
}
