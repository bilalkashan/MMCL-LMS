import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import api from  '../../api';

function CourseList() {
  const [courses, setCourses] = useState([]);
  const [enrolled, setEnrolled] = useState([]);

  useEffect(() => {
    axios.get('/api/courses').then(r=>setCourses(r.data));
    axios.get('/api/enroll').then(r=>setEnrolled(r.data));
  }, []);

  const enroll = async id => {
    await axios.post('/api/enroll', { courseId: id });
    setEnrolled([...enrolled, { courseId: id, completed: false }]);
  };

  return <div>{
    courses.map(c => {
      const isEn = enrolled.find(e => e.courseId===c._id);
      return (
        <div key={c._id}>
          <h4>{c.title}</h4>
          <p>{c.description}</p>
          {isEn ? <Link to={`/course/${c._id}`}>Go to Course</Link>
                : <button onClick={()=>enroll(c._id)}>Enroll</button>}
        </div>
      );
    })
  }</div>;
}
export default CourseList;
