import React, { useEffect, useState } from 'react';
import styles from './requestUsers.module.css';
// import { handleSuccess } from '../../toast';
import Sidebar from '../sidebar/sidebar';
import api from '../../api';

const RequestUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.post('/getTotalUsers') 
      .then(res => {
        if (res.data && Array.isArray(res.data.users)) {
          setUsers(res.data.users);
        } else {
          setUsers([]);
        }
      })
      .catch(err => {
        console.error("Error fetching users:", err);
        setUsers([]);
      });
  }, []);

  // const handleAccept = (userId) => {
  //   api.post('/acceptUser', { userId })
  //     .then(res => {
  //       if (res.data.success) {
  //         setUsers(prev => prev.filter(user => user._id !== userId));
  //         handleSuccess("User accepted successfully!");
  //       }
  //     })
  //     .catch(err => console.error("Error accepting user:", err));
  // };

  // const handleRemove = (userId) => {
  //   api.post('/deleteUserRequest', { userId })
  //     .then(res => {
  //       if (res.data.success) {
  //         setUsers(prev => prev.filter(user => user._id !== userId));
  //         handleSuccess("User has been deleted successfully");
  //       }
  //     })
  //     .catch(err => console.error("Error removing user:", err));
  // };

  return (
    <div className={styles.userRequestContainer}>
      <Sidebar />
      <div className={styles.container}>
        <h2 className={styles.title}>Total Employees Registered</h2>
        <p className={styles.totalUsers}>Total Users: {users.length}</p>

        {users.length === 0 ? (
          <p className={styles.noRequestsMessage}>No requests</p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Role</th>
                  {/* <th>Actions</th> */}
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.is_verified ? "Verified" : "Not Verified"}</td>
                    <td>{user.role}</td>
                    {/* <td>
                      <button
                        className={styles.acceptButton}
                        onClick={() => handleAccept(user._id)}
                      >
                        Accept
                      </button>
                      <button
                        className={styles.removeButton}
                        onClick={() => handleRemove(user._id)}
                      >
                        Remove
                      </button>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestUsers;