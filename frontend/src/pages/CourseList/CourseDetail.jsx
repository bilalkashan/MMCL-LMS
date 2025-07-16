import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

function CourseDetail() {
    const { id } = useParams();
    const [course, setCourse] = useState({});
    const [enrollment, setEnrollment] = useState(null);

    useEffect(() => {
        axios.get(`/api/courses`).then(r => setCourse(r.data.find(c => c._id === id)));
        axios.get(`/api/enroll`).then(r => setEnrollment(r.data.find(e => e.courseId === id)));
    }, [id]);

    const complete = () => {
        axios.put(`/api/enroll/complete/${enrollment._id}`).then(r => setEnrollment(r.data));
    };

    return <div>
        <h3>{course.title}</h3>
        <iframe src={course.videoUrl} title="Video" width="600" height="350" />
        <p>{course.description}</p>
        <a href={course.pdfUrl} target="_blank">Download PDF</a><br />
        <a href={course.bookUrl} target="_blank">Download Book</a><br />

        {!enrollment.completed ? <button onClick={complete}>Mark Completed</button>
            : <Link to={`/quiz/${id}`}>Take Quiz</Link>}
    </div>;
}
export default CourseDetail;
