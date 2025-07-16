import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function CertificatePage() {
  const { id } = useParams();
  const [cert, setCert] = useState(null);

  useEffect(() => {
    axios.get(`/api/certificates/${id}`).then(r=>setCert(r.data));
  }, [id]);

  return cert ? (
    <div style={{ border: '2px solid #003366', padding: '30px', textAlign: 'center', maxWidth: '600px', margin: 'auto' }}>
      <h2>Certificate of Completion</h2>
      <p>Congratulations, you've earned this certificate for</p>
      <h3 style={{ color: '#E90708' }}>{cert.courseTitle}</h3>
      <p>Date: {new Date(cert.issuedAt).toLocaleDateString()}</p>
      <button onClick={() => window.print()}>Print/Save</button>
    </div>
  ) : "Fetching certificate...";
}
export default CertificatePage;
