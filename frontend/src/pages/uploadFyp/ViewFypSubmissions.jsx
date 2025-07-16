import React, { useEffect, useState } from "react";
import UploadFypModal from "./UploadFypModal";
import styles from "./ViewFypSubmissions.module.css";
import Taskbar from "../taskbar/taskbar";
import Futtor from "../futtor/futtor";
import { FaFilePdf, FaVideo, FaLink } from "react-icons/fa";
import api from "../../api";

const ViewFypSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const user = JSON.parse(localStorage.getItem("loggedInUser"));
      if (!user?._id) return;
      try {
        const res = await api.get(`/fyp/get-student-fyp/${user._id}`);
        setSubmissions((res.data.data || []).filter(f => f.isApproved));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <>
      <Taskbar />
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>FYP Submissions</h2>
          <button onClick={() => setShowModal(true)}>Upload FYP</button>
        </div>

        {showModal && <UploadFypModal onClose={() => setShowModal(false)} />}

        {loading ? (
          <p>Loading…</p>
        ) : submissions.length === 0 ? (
          <p>No approved submissions.</p>
        ) : (
          submissions.map(f => (
            <div key={f._id} className={styles.card}>
              <h3>{f.title}</h3>
              <span className={f.isApproved ? styles.approved : styles.pending}>
                {f.isApproved ? "Approved" : "Pending"}
              </span>
              <p><strong>Group:</strong> {f.groupMembers.join(", ")}</p>
              <p><strong>Description:</strong> {f.description}</p>
              <a href={f.projectLink} target="_blank" rel="noreferrer"><FaLink /> Project</a>
              <div>
                <a href={f.srs} download><FaFilePdf /> SRS</a>
                <a href={f.sds} download><FaFilePdf /> SDS</a>
                <a href={f.video} target="_blank" rel="noreferrer"><FaVideo /> Video</a>
              </div>
              <p><strong>Adviser:</strong> {f.adviser?.name || "Pending"}</p>
            </div>
          ))
        )}
      </div>
      <Futtor />
    </>
  );
};

export default ViewFypSubmissions;
