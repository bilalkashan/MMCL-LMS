import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api';
import styles from './CourseDetail.module.css';

const CourseDetail = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get('/course/myCourses');
        const data = res.data.courses.find(c => c._id === courseId);
        if (data) {
          setCourse(data);
          setAnswers(new Array(data.quiz.length).fill(null));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  const handleAnswerChange = (questionIndex, optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleSubmitQuiz = async () => {
    try {
      const res = await api.post(`/course/submitQuiz/${courseId}`, { answers });
      setResult(res.data);
      setSubmitted(true);
    } catch (err) {
      console.error('Quiz submission error:', err);
    }
  };

  if (loading) return <p className={styles.loading}>Loading...</p>;
  if (!course) return <p className={styles.error}>Course not found or not enrolled</p>;

  return (
    <div className={styles.container}>
      <h2>{course.title}</h2>
      <p><strong>Category:</strong> {course.category}</p>
      <p>{course.description}</p>

      <div className={styles.videoWrapper}>
        <video controls width="100%">
          <source src={course.videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {submitted ? (
        <div className={styles.result}>
          <h3>Quiz Result</h3>
          <p><strong>Score:</strong> {result?.score} / {course.quiz.length}</p>
          <p className={result?.success ? styles.pass : styles.fail}>
            {result?.success ? 'You Passed!' : 'You Failed. Try Again.'}
          </p>
          {result?.certificateUrl && (
            <a href={result.certificateUrl} target="_blank" rel="noreferrer">
              🎓 View E-Certificate
            </a>
          )}
        </div>
      ) : (
        <div className={styles.quizSection}>
          <h3>Quiz</h3>
          {course.quiz.map((q, i) => (
            <div key={i} className={styles.questionBlock}>
              <p><strong>Q{i + 1}:</strong> {q.question}</p>
              {q.options.map((opt, j) => (
                <label key={j} className={styles.optionLabel}>
                  <input
                    type="radio"
                    name={`q${i}`}
                    value={j}
                    checked={answers[i] === j}
                    onChange={() => handleAnswerChange(i, j)}
                  />
                  {opt}
                </label>
              ))}
            </div>
          ))}
          <button
            onClick={handleSubmitQuiz}
            disabled={answers.includes(null)}
            className={styles.submitBtn}
          >
            Submit Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;
