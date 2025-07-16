import styles from "./parallax.module.css";
import Banner from "./slider1.jpg";
import { Parallax } from "react-parallax";

const Slider = () => {
  return (
    <div className="App">
      <Parallax className={styles.parallax} strength={200} bgImage={Banner}>
        <div className={styles.sliderContent}>
          {/* <div className={styles.textContent}>
            <h1>Welcome to FYPedia</h1>
            <p>Your smart solution for Final Year Projects</p>
          </div> */}
        </div>
      </Parallax>
    </div>
  );
};

export default Slider;
