import React, { useState } from 'react';
import { MdCloudUpload } from 'react-icons/md';
import { IoCloseCircle } from 'react-icons/io5';
import api from '../../api';
import styles from './AddCourse.module.css';
import { handleError, handleSuccess } from "../../toast";

const AddCourse = ({ onClose, onCourseAdded }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Technical',
    video: null,
    quiz: [{ question: '', options: ['', '', '', ''], correctAnswerIndex: 0 }]
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleVideoChange = e => {
    setForm({ ...form, video: e.target.files[0] });
  };

  const handleQuizChange = (idx, field, value) => {
    const newQuiz = [...form.quiz];
    if (field === 'question') {
      newQuiz[idx].question = value;
    } else if (field.startsWith('option')) {
      const optionIndex = Number(field.slice(-1));
      newQuiz[idx].options[optionIndex] = value;
    } else if (field === 'correctAnswerIndex') {
      newQuiz[idx].correctAnswerIndex = Number(value);
    }
    setForm({ ...form, quiz: newQuiz });
  };

  const addQuizQuestion = () => {
    setForm({
      ...form,
      quiz: [...form.quiz, { question: '', options: ['', '', '', ''], correctAnswerIndex: 0 }]
    });
  };

  const removeQuizQuestion = idx => {
    const newQuiz = form.quiz.filter((_, i) => i !== idx);
    setForm({ ...form, quiz: newQuiz });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append('title', form.title);
      data.append('description', form.description);
      data.append('category', form.category);
      data.append('video', form.video);
      data.append('quiz', JSON.stringify(form.quiz));

      const res = await api.post('/addCourse', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        handleSuccess("Course added successfully");
        setForm({
          title: '',
          description: '',
          category: 'Technical',
          video: null,
          quiz: [{ question: '', options: ['', '', '', ''], correctAnswerIndex: 0 }]
        });
        if (onCourseAdded) onCourseAdded();
        onClose();
      } else {
        handleError("Something went wrong.");
      }
    } catch (error) {
      console.error(error);
      handleError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <IoCloseCircle className={styles.closeBtn} onClick={onClose} />
        <h2 className={styles.newCourseHead}>Add New Course</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input name="title" placeholder="Course Title" value={form.title} onChange={handleInputChange} required />
          <textarea name="description" placeholder="Course Description" value={form.description} onChange={handleInputChange} />
          <select name="category" value={form.category} onChange={handleInputChange}>
            <option value="Technical">Technical</option>
            <option value="Soft Skills">Soft Skills</option>
            <option value="Policy">Policy</option>
          </select>
          <input type="file" accept="video/*" onChange={handleVideoChange} required />

          <h3>Quiz Questions</h3>
          {form.quiz.map((q, idx) => (
            <div key={idx} className={styles.quizQuestion}>
              <input placeholder="Add any question" value={q.question} onChange={e => handleQuizChange(idx, 'question', e.target.value)} required />
              {[0, 1, 2, 3].map(i => (
                <input key={i} placeholder={`Option ${i + 1}`} value={q.options[i]} onChange={e => handleQuizChange(idx, `option${i}`, e.target.value)} required />
              ))}
              <select value={q.correctAnswerIndex} onChange={e => handleQuizChange(idx, 'correctAnswerIndex', e.target.value)}>
                <option value={0}>Correct: Option 1</option>
                <option value={1}>Correct: Option 2</option>
                <option value={2}>Correct: Option 3</option>
                <option value={3}>Correct: Option 4</option>
              </select>
              {form.quiz.length > 1 && (
                <button type="button" onClick={() => removeQuizQuestion(idx)} className={styles.removeBtn}>
                  Remove
                </button>
              )}
              <button type="button" onClick={addQuizQuestion} className={styles.addBtn}>+ Add Question</button>

            </div>
          ))}
          <button type="submit" disabled={loading}>
            {loading ? <MdCloudUpload size={22} /> : 'Add Course'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCourse;
