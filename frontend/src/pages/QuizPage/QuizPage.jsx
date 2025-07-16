import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function QuizPage() {
    const { id } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [ans, setAns] = useState([]);
    const [result, setResult] = useState(null);

    useEffect(() => axios.get(`/api/quiz/${id}`).then(r => setQuiz(r.data)), [id]);

    const submit = async () => {
        const res = await axios.post(`/api/quiz/submit/${quiz._id}`, { answers: ans });
        setResult(res.data);
    };

    if (!quiz) return 'Loading...';
    if (result) return result.passed ? <div>🎉 Passed! <a href={`/certificate/${id}`}>Download Certificate</a></div>
        : <div>😞 Failed – Score: {result.score}</div>;

    return <div>{
        quiz.questions.map((q, i) => <div key={i}>
            <p>{q.question}</p>
            {q.options.map((o, j) =>
                <label key={j}>
                    <input type="radio" name={`q${i}`} onChange={() => { const a = [...ans]; a[i] = j; setAns(a); }} />
                    {o}
                </label>
            )}
        </div>)
    }<button onClick={submit}>Submit Quiz</button></div>;
}
export default QuizPage;
