import React from 'react';
import styles from './about.module.css';
import Taskbar from '../taskbar/taskbar';
import Futtor from '../futtor/futtor';

const About = () => {
  return (
    <div>
      <Taskbar />
    <div className={styles.aboutContainer}>
      <h1 className={styles.title}>About FYPedia</h1>
      <p className={styles.text}>
        FYPedia is an innovative initiative by SZABIST, designed as a central portal for all Final Year Projects (FYPs). This platform is dedicated to supporting SZABIST students by providing a single, comprehensive source of information on past FYPs. Through FYPedia, students can access a vast archive of project documentation, videos, and essential details, which empowers them to refine their ideas, avoid duplication, and enhance the originality of their projects.
      </p>
      <p className={styles.text}>
        FYPedia is more than just a repository—it’s a collaborative resource aimed at fostering creativity and knowledge-sharing within the SZABIST community. By offering detailed insights into previous projects, FYPedia serves as an invaluable tool for students, faculty, and researchers, promoting a culture of innovation and continuous improvement.
      </p>

      <h2 className={styles.subTitle}>About SZABIST</h2>
      <p className={styles.text}>
        The Shaheed Zulfikar Ali Bhutto Institute of Science and Technology (SZABIST) is a fully Chartered Institute, established through a Legislative Act of the Pakistan Assembly (Sindh Act No. XI of 1995) and recognized by the Higher Education Commission (HEC), Pakistan. SZABIST operates campuses in Karachi, Islamabad, Larkana, and Dubai, offering a wide range of programs in Science, Technology, Engineering, and Management.
      </p>
      <p className={styles.text}>
        With a strong commitment to academic excellence, SZABIST is a member of several prestigious global university associations, including the International Association of Universities (IAU), the Association of Commonwealth Universities (ACU), and the Federation of the Universities of Islamic World (FUIW). SZABIST’s mission is to develop competent professionals and leaders, and FYPedia aligns with this mission by nurturing the next generation of innovators and problem-solvers.
      </p>
    </div>
    <Futtor />
    </div>
  );
};

export default About;