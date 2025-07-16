import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./dashboard.module.css";
import Futtor from "../futtor/futtor";
import Taskbar from "../taskbar/taskbar";

const departments = [
  {
    name: "Computer Science (CS)",
    description: "Innovative technology and programming.",
    icon: "💻",
    departmentId: "bcsbs",
  },
  {
    name: "Software Engineering (SE)",
    description: "Building scalable software systems.",
    icon: "🛠️",
    departmentId: "bsse",

  },
  {
    name: "Artificial Intelligence (AI)",
    description: "Leading the future with AI.",
    icon: "🤖",
    departmentId: "bsai",

  },
];

const years = {
  "Computer Science (CS)": [
    "2025",
    "2024",
    "2023",
    "2022",
    "2021",
    "2020",

  ],
  "Software Engineering (SE)": [
     "2025",
    "2024",
    "2023",
    "2022",
    "2021",
    "2020",

  ],
  "Artificial Intelligence (AI)": [
    "2025",
    "2024",
    "2023",
    "2022",
    "2021",
    "2020",

  ],
};

function Dashboard() {
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleDepartmentClick = (dept) => {
    setSelectedDepartment(dept);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleYearClick = (year) => {
    let sendYear;
    const yearInt = parseInt(year, 10);
    sendYear = (yearInt - 4).toString();
    
    navigate("/fypList", {
      state: { year: sendYear, department: selectedDepartment.departmentId },
    });
  };

  const filteredYears = selectedDepartment
    ? years[selectedDepartment.name].filter((year) =>
        year.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div>
        <Taskbar />
    <div className={styles.dashboardContainer}>
      {!selectedDepartment ? (
        <>
          <h1>Select Your Department</h1>
          <div className={styles.departmentCards}>
            {departments.map((dept, index) => (
              <div
                key={index}
                className={styles.dashboardCard}
                onClick={() => handleDepartmentClick(dept)}
              >
                <div className={styles.icon}>{dept.icon}</div>
                <h2>{dept.name}</h2>
                <p>{dept.description}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <h1>{selectedDepartment.name} - Select Year</h1>
          <input
            type="text"
            placeholder="Search Year"
            value={searchTerm}
            onChange={handleSearch}
            className={styles.searchBar}
          />
          <div className={styles.yearList}>
            {filteredYears.length > 0 ? (
              filteredYears.map((year, index) => (
                <div
                  key={index}
                  className={styles.dashboardCard}
                  onClick={() => handleYearClick(year)}
                >
                  <h2>{year}</h2>
                </div>
              ))
            ) : (
              <div className={styles.noResults}>
                <img
                  src="/images/no-search-found.png"
                  className={styles.noResultsImage}
                  alt="No Result Found"
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
    <Futtor />
    </div>

  );
}

export default Dashboard;