import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "./fyplist.module.css";
import Futtor from "../futtor/futtor";
import Taskbar from "../taskbar/taskbar";
import { FaFilePdf, FaVideo, FaLink } from "react-icons/fa";
import api from "../../api";

function FypList() {
  const location = useLocation();
  const { year, department } = location.state || {};

  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const fetchFyps = async () => {
      try {
        const res = await api.get(`/fyp/filter`, {
          params: {
            department: department?.split(" ")[0].toLowerCase(),
            year,
          },
        });

        if (res.data.success) {
          setSubmissions(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching filtered FYPs", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFyps();
  }, [department, year]);
  const filteredSubmissions = submissions.filter((sub) => {
    const term = searchTerm.toLowerCase();
    return (
      sub.title?.toLowerCase().includes(term) ||
      sub.groupMembers?.some((reg) => reg.toLowerCase().includes(term)) ||
      sub.adviser?.name?.toLowerCase().includes(term)
    );
  });

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <Taskbar />
      <div className={styles.container}>
        {!selectedSubmission ? (
          <>
            <div className={styles.centeredContainer}>
              <h2>
                FYP Submissions - {department} ({year})
              </h2>

              <input
                type="text"
                placeholder="Search by project, reg#, or adviser"
                value={searchTerm}
                onChange={handleSearch}
                className={styles.searchInput}
              />

              {filteredSubmissions.length === 0 ? (
                <p>No matching submissions found.</p>
              ) : (
                <table className={styles.fypTable}>
                  <thead>
                    <tr>
                      <th>Project Title</th>
                      <th>Group Members</th>
                      <th>Adviser</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubmissions.map((sub) => (
                      <tr key={sub._id}>
                        <td>{sub.title}</td>
                        <td>{sub.groupMembers?.join(", ")}</td>
                        <td>{sub.adviser?.name || "N/A"}</td>
                        <td>
                          <button
                            className={styles.detailButton}
                            onClick={() => setSelectedSubmission(sub)}
                          >
                            More Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        ) : (
          <div className={styles.detailsCard}>
            <h2 className={styles.detailTitle}>{selectedSubmission.title}</h2>

            <div className={styles.detailSection}>
              <p>
                <strong>Description:</strong> {selectedSubmission.description}
              </p>
              <p>
                <strong>Group Members:</strong>{" "}
                {selectedSubmission.groupMembers?.join(", ")}
              </p>
              <p>
                <strong>Adviser:</strong>{" "}
                {selectedSubmission.adviser?.name || "N/A"}
              </p>
              <p>
                <strong>Project Link:</strong>{" "}
                <a
                  href={selectedSubmission.projectLink}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.iconLink}
                >
                  <FaLink className={styles.icon} /> View Project
                </a>
              </p>
            </div>

            <div className={styles.filesGrid}>
              <a
                href={selectedSubmission.srs}
                download
                target="_blank"
                rel="noreferrer"
                className={styles.fileCard}
              >
                <FaFilePdf className={styles.fileIcon} />
                <span>SRS</span>
              </a>
              <a
                href={selectedSubmission.sds}
                download
                target="_blank"
                rel="noreferrer"
                className={styles.fileCard}
              >
                <FaFilePdf className={styles.fileIcon} />
                <span>SDS</span>
              </a>
              <a
                href={selectedSubmission.video}
                target="_blank"
                rel="noreferrer"
                className={styles.fileCard}
              >
                <FaVideo className={styles.fileIcon} />
                <span>Video</span>
              </a>
            </div>

            <button
              className={styles.backButton}
              onClick={() => setSelectedSubmission(null)}
            >
              ← Back to List
            </button>
          </div>
        )}
      </div>
      <Futtor />
    </div>
  );
}

export default FypList;
