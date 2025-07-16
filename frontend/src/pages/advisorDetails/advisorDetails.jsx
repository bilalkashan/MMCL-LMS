import Advisor from "./advisor";
import styles from "./advisor.module.css";
import Futtor from "../futtor/futtor";
import Taskbar from "../taskbar/taskbar";

const AdvisorData = [
    {
      title: "Dr. Imran Amin",
      description: "Room 203, 100 Campus",
      image: "/assets/imranamin.png" 
    },
    {
      title: "Dr. Husnain Mansoor",
      description: "Room 303, 100 Campus",    
      image: "/assets/husnainmansoor.jpg" 
    },
    {
      title: "Dr. Sajjad Hussain",
      description: "Room 103, 100 Campus",    
      image: "/assets/sajjadhussain.jpg" 
    },
    {
      title: "Dr. Adeel Ansari",
      description: "Room 301, 100 Campus",    
      image: "/assets/adeelansari.jpg"
    },
    {
      title: "Dr. Muhammad Raza",
      description: "Room 101, 100 Campus",    
      image: "/assets/mraza.jpg" // Example image URL
    },
    {
      title: "Dr. Irfan Khan Tanoli",
      description: "203B Room , 100 Campus",    
      image: "/assets/irfankhan.jpg" 
    },
    {
      title: "Sir Asim Riaz",
      description: "Room 301, 100 Campus",    
      image: "/assets/asimriaz.jpg"
    },
    {
      title: "Sir Shahzad Haroon",
      description: "Room 103, 100 Campus",    
      image: "/assets/shahzadharoon.jpg"
    },
    {
      title: "Sir Asif Khalid Qureshi",
      description: "Room 204, 100 Campus",    
      image: "/assets/asifkhalid.jpg"
    },
    {
      title: "Sir Adeel Karim",
      description: "Room 204, 100 Campus",    
      image: "/assets/adeelkarim.jpg" 
    },
    {
      title: "Sir Khawaja Mohiuddin",
      description: "Room 304, 100 Campus",    
      image: "/assets/khawajamohiuddin.jpg" 
    },
    {
      title: "Sir Waqar Ahmad",
      description: "Room 201, 100 Campus",    
      image: "/assets/waqarahmed.jpg" 
    },
    {
      title: "Sir Ali Mobin",
      description: "Room 303, 100 Campus",    
      image: "/assets/alimobin.jpg" 
    },
    {
      title: "Sir Faraz Afsar",
      description: "Room 204, 100 Campus",    
      image: "/assets/farazafsar.jpg" 
    },
  ];

const AdvisorDetails = () => {
  return (
    <>
      <Taskbar />
      <div className={styles.servicesContainer} id="service">
        <h1 className={styles.myTitle}>Our Faculty</h1>
        <h4 className={styles.teamDescription}>
          Our team is dedicated to supporting your success and helping you achieve all your computer science aspirations.
        </h4>
        <div className={styles.servicesCards}>
          {AdvisorData.map((service, index) => (
            <Advisor
              key={index}
              title={service.title}
              disc={service.description}
              image={service.image}
            />
          ))}
        </div>
      </div>
      <footer><Futtor /></footer>
    </>
  );
};

export default AdvisorDetails;