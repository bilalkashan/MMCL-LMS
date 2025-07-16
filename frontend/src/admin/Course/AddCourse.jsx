import React, { useState } from 'react';
import api from '../../api';
import styles from './AddCourse.module.css';

const AddCourse = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Technical',
    video: null,
    quiz: [{ question: '', options: ['', '', '', ''], correctAnswerIndex: 0 }]
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleInputChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleVideoChange = e => {
    setForm({ ...form, video: e.target.files[0] });
  };

  const handleQuizChange = (idx, field, value) => {
    const newQuiz = [...form.quiz];
    if(field === 'question') {
      newQuiz[idx].question = value;
    } else if(field.startsWith('option')) {
      const optionIndex = Number(field.slice(-1));
      newQuiz[idx].options[optionIndex] = value;
    } else if(field === 'correctAnswerIndex') {
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
    setMessage(null);

    try {
      const data = new FormData();
      data.append('title', form.title);
      data.append('description', form.description);
      data.append('category', form.category);
      data.append('video', form.video);
      data.append('quiz', JSON.stringify(form.quiz));

      const res = await api.post('/course/addCourse', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        setMessage('Course added successfully');
        setForm({
          title: '',
          description: '',
          category: 'Technical',
          video: null,
          quiz: [{ question: '', options: ['', '', '', ''], correctAnswerIndex: 0 }]
        });
      } else {
        setMessage('Failed to add course');
      }
    } catch (error) {
      console.error(error);
      setMessage('Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Add New Course</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>Title
          <input name="title" value={form.title} onChange={handleInputChange} required />
        </label>
        <label>Description
          <textarea name="description" value={form.description} onChange={handleInputChange} />
        </label>
        <label>Category
          <select name="category" value={form.category} onChange={handleInputChange}>
            <option>Technical</option>
            <option>Soft Skills</option>
            <option>Policy</option>
          </select>
        </label>
        <label>Video (mp4, max 100MB)
          <input type="file" accept="video/*" onChange={handleVideoChange} required />
        </label>

        <h3>Quiz Questions</h3>
        {form.quiz.map((q, idx) => (
          <div key={idx} className={styles.quizQuestion}>
            <input
              placeholder="Question"
              value={q.question}
              onChange={e => handleQuizChange(idx, 'question', e.target.value)}
              required
            />
            {[0,1,2,3].map(i => (
              <input
                key={i}
                placeholder={`Option ${i + 1}`}
                value={q.options[i]}
                onChange={e => handleQuizChange(idx, `option${i}`, e.target.value)}
                required
              />
            ))}
            <label>
              Correct Answer
              <select
                value={q.correctAnswerIndex}
                onChange={e => handleQuizChange(idx, 'correctAnswerIndex', e.target.value)}
              >
                <option value={0}>Option 1</option>
                <option value={1}>Option 2</option>
                <option value={2}>Option 3</option>
                <option value={3}>Option 4</option>
              </select>
            </label>
            {form.quiz.length > 1 && (
              <button type="button" onClick={() => removeQuizQuestion(idx)}>Remove Question</button>
            )}
          </div>
        ))}
        <button type="button" onClick={addQuizQuestion}>Add Question</button>

        <button type="submit" disabled={loading}>{loading ? 'Uploading...' : 'Add Course'}</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddCourse;
