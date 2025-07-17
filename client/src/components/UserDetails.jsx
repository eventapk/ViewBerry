import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${id}`);
        if (res.data) {
          setUser(res.data); // ✅ assuming backend returns full user object
        } else {
          setError("User not found.");
        }
      } catch (err) {
        console.error("❌ Error fetching user details:", err.message);
        setError("Failed to load user.");
      }
    };
    fetchUser();
  }, [id]);

  if (error) {
    return <div style={styles.loading}>{error}</div>;
  }

  if (!user) {
    return <div style={styles.loading}>Loading user details...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>👤 User Details</h2>
        <div style={styles.grid}>
          <Field label="First Name" value={user.firstName} />
          <Field label="Last Name" value={user.lastName} />
          <Field label="Email" value={user.email} />
          <Field label="Phone" value={user.phone} />
          <Field label="Address" value={user.address} />
          <Field label="City" value={user.city} />
          <Field label="State" value={user.state} />
          <Field label="Country" value={user.country} />
          <Field label="Category" value={user.category} />
        </div>
        <button style={styles.button} onClick={() => navigate("/table")}>
          ⬅ Back to Users Table
        </button>
      </div>
    </div>
  );
}

const Field = ({ label, value }) => (
  <div style={styles.field}>
    <span style={styles.label}>{label}:</span>
    <span style={styles.value}>{value || "-"}</span>
  </div>
);

const styles = {
  container: {
    backgroundColor: "#e9eef5",
    minHeight: "100vh",
    padding: "40px 20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "30px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "700px",
  },
  title: {
    textAlign: "center",
    marginBottom: "30px",
    color: "#333",
    fontSize: "24px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    padding: "10px",
    backgroundColor: "#f8f9fc",
    borderRadius: "8px",
    border: "1px solid #e0e0e0",
  },
  label: {
    fontWeight: "600",
    fontSize: "14px",
    color: "#555",
    marginBottom: "4px",
  },
  value: {
    fontSize: "16px",
    color: "#222",
  },
  button: {
    marginTop: "30px",
    padding: "12px",
    width: "100%",
    backgroundColor: "#1976d2",
    color: "#fff",
    fontSize: "16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  loading: {
    textAlign: "center",
    paddingTop: "80px",
    fontSize: "18px",
    color: "#444",
  },
};

export default UserDetails;
