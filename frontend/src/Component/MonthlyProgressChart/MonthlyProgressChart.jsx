import React, { useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import styles from './MonthlyProgressChart.module.css';
// import axios from 'axios';

const MonthlyProgressBarChart = ({ userId }) => {
    const [data, setData] = useState([]);
    const [filter, setFilter] = useState('all');

    //   useEffect(() => {
    //     if (userId) {
    //       axios.get(`http://localhost:8080/employee/monthly-progress/${userId}`)
    //         .then(res => {
    //           setData(res.data);
    //         }).catch(() => {
    //           setData([]);
    //         });
    //     }
    //   }, [userId]);

    useEffect(() => {
        const dummyMonthlyData = [
            { month: 'Jan', completed: 1, inprogress: 2, incomplete: 1 },
            { month: 'Feb', completed: 2, inprogress: 1, incomplete: 3 },
            { month: 'Mar', completed: 4, inprogress: 3, incomplete: 2 },
            { month: 'Apr', completed: 4, inprogress: 1, incomplete: 1 },
            { month: 'May', completed: 3, inprogress: 2, incomplete: 2 },
            { month: 'Jun', completed: 2, inprogress: 2, incomplete: 1 },
            { month: 'Jul', completed: 6, inprogress: 4, incomplete: 2 },
            // { month: 'Aug', completed: 2, in_progress: 1, incomplete: 0 },
            // { month: 'Sep', completed: 0, in_progress: 3, incomplete: 2 },
            // { month: 'Oct', completed: 4, in_progress: 1, incomplete: 1 },
            // { month: 'Nov', completed: 3, in_progress: 2, incomplete: 2 },
            // { month: 'Dec', completed: 2, in_progress: 2, incomplete: 0 },
            
        ];

        setData(dummyMonthlyData); 
    }, []);

    const getBars = () => {
        if (filter === 'completed') return <Bar dataKey="completed" fill="#2ecc71" />;
        if (filter === 'inprogress') return <Bar dataKey="inprogress" fill="#f39c12" />;
        if (filter === 'incomplete') return <Bar dataKey="incomplete" fill="#e74c3c" />;
        return (
            <>
                <Bar dataKey="completed" fill="#2ecc71" />
                <Bar dataKey="inprogress" fill="#f39c12" />
                <Bar dataKey="incomplete" fill="#e74c3c" />
            </>
        );
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Monthly Course Progress</h2>

            <div className={styles.filterWrapper}>
                <label>Filter:</label>
                <select value={filter} onChange={(e) => setFilter(e.target.value)} className={styles.dropdown}>
                    <option value="all">All</option>
                    <option value="completed">Completed</option>
                    <option value="inprogress">inprogress</option>
                    <option value="incomplete">Incomplete</option>
                </select>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    {getBars()}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default MonthlyProgressBarChart;
