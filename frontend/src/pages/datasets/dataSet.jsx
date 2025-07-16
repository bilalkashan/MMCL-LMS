import React from "react";
import styles from "./dataSet.module.css";
// import Taskbar from "../taskbar/taskbar";
import DatasetCard from "./datasetCard";
// import Futtor from "../futtor/futtor";
import Sidebar from "../../admin/sidebar/sidebar"
import ProfileHeader from "../../Component/ProfileHeader/profileHeader";

const Data = [

  {
    img: "/assets/MM Logo.png",
    alt: "Certificate Name 1",
    name: "Certificate Name",
    desc: "A certificate, in general, is a document that serves as evidence or confirmation of something, such as a person's qualifications, status, or the truth of a statement. .",
    // link: "https://opendata.com.pk/"
  },
  {
    img: "/assets/MM Logo.png",
    alt: "Certificate Name 2",
    name: "Certificate Name",
    desc: "A certificate, in general, is a document that serves as evidence or confirmation of something, such as a person's qualifications, status, or the truth of a statement. ",
    // link: "https://data.gov/"
  },
  {
    img: "/assets/MM Logo.png",
    alt: "Certificate Name 3",
    name: "Certificate Name",
    desc: "A certificate, in general, is a document that serves as evidence or confirmation of something, such as a person's qualifications, status, or the truth of a statement. ",
    // link: "https://www.data.gov.uk/"
  }

];

const DataSet = () => {
  const card = Data.map((item, index) => {
    return <DatasetCard key={index} image={item.img} name={item.name} desc={item.desc} link={item.link} />;
  });

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

        <div className={styles.cardsWrapper}> 
          <div className={styles.statsCardsWrapper}>
            {/* <h1 className={styles.dataHeading}>Certificates</h1> */}
            {/* <div className={styles.wrapper}> */}
              {card}
            {/* </div> */}
          </div>
        </div>
        </main>
      </div>
    </>
  );
};

export default DataSet;