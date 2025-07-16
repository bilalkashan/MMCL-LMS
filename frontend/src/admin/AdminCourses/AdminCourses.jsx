import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminCourses = () =>{
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ category: 'Technical', title: '', description: '' });
  const [video, setVideo] = useState(null);

  const load = async () => setCourses((
    await axios.get('/api/courses')).data);
  useEffect(load, []);

  const onSubmit = async e => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    fd.append('video', video);
    await axios.post('/api/courses', fd);
    setForm({ category: 'Technical', title: '', description: '' });
    setVideo(null);
    load();
  };

  const del = async id => {
    await axios.delete(`/api/courses/${id}`);
    load();
  };

  return (
    <div>
      <h2>Admin Manage Courses</h2>
      <form onSubmit={onSubmit}>
        <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
          <option>Technical</option><option>Soft Skills</option><option>Policy</option>
        </select>
        <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Title" />
        <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Description" />
        <input type="file" accept="video/*" onChange={e=>setVideo(e.target.files[0])} />
        <button type="submit">Add Course</button>
      </form>

      <ul>
        {courses.map(c=>(
          <li key={c._id}>
            {c.title} [{c.category}]
            <button onClick={()=>del(c._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}


export default AdminCourses;