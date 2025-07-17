  // src/components/UsersTable.jsx
  import React, { useEffect, useState } from "react";
  import { useNavigate } from "react-router-dom";
  import axios from "axios";

  const UsersTable = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const response = await axios.get("http://localhost:5000/api/users");
          setUsers(response.data || []); // Fallback in case data.users is undefined
        } catch (err) {
          console.error("❌ Error fetching users:", err.message);
        }
      };
      fetchUsers();
    }, []);

    const handleRowClick = (id) => {
      navigate(`/user/${id}`);
    };

    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.heading}>👥 Firestore Users Table</h2>
          <div style={styles.scrollTable}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>First</th>
                  <th style={styles.th}>Last</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Phone</th>
                  <th style={styles.th}>Address</th>
                  <th style={styles.th}>City</th>
                  <th style={styles.th}>State</th>
                  <th style={styles.th}>Country</th>
                  <th style={styles.th}>Category</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr
                      key={user.id}
                      onClick={() => handleRowClick(user.id)}
                      style={styles.tr}
                    >
                      <td style={styles.td}>{user.firstName}</td>
                      <td style={styles.td}>{user.lastName}</td>
                      <td style={styles.td}>{user.email}</td>
                      <td style={styles.td}>{user.phone}</td>
                      <td style={styles.td}>{user.address}</td>
                      <td style={styles.td}>{user.city}</td>
                      <td style={styles.td}>{user.state}</td>
                      <td style={styles.td}>{user.country}</td>
                      <td style={styles.td}>{user.category}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td style={styles.td} colSpan="9">No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const styles = {
    container: {
      backgroundColor: "#e9eef5",
      minHeight: "100vh",
      padding: "40px 20px",
      display: "flex",
      justifyContent: "center",
    },
    card: {
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      padding: "30px",
      boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
      width: "100%",
      maxWidth: "1200px",
    },
    heading: {
      textAlign: "center",
      marginBottom: "25px",
      color: "#333",
      fontSize: "24px",
    },
    scrollTable: {
      overflowX: "auto",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      fontFamily: "Segoe UI, sans-serif",
    },
    th: {
      backgroundColor: "#1976d2",
      color: "#ffffff",
      padding: "12px",
      textAlign: "center",
      fontSize: "16px",
    },
    td: {
      padding: "12px",
      borderBottom: "1px solid #ddd",
      textAlign: "center",
      fontSize: "15px",
      color: "#333",
    },
    tr: {
      cursor: "pointer",
      transition: "background 0.3s",
    },
  };

  export default UsersTable;
