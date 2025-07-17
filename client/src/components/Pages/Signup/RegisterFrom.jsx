import React, { useState } from 'react';
import axios from 'axios';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: '',
    phone: '', address: '', country: '', state: '', city: '',
    category: '', newCategory: '', institution: ''
  });

  const [categories, setCategories] = useState(["School", "Office", "College", "Others"]);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "password") setPasswordStrength(checkPasswordStrength(value));
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const checkPasswordStrength = (password) => {
    if (!password) return '';
    const strong = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    const medium = /^.{6,}$/;
    if (strong.test(password)) return 'Strong';
    if (medium.test(password)) return 'Medium';
    return 'Weak';
  };

  const handleCategoryChange = (e) => {
    const selected = e.target.value;
    setFormData(prev => ({
      ...prev,
      category: selected,
      newCategory: ''
    }));
  };

  const addNewCategory = () => {
    const newCat = formData.newCategory.trim();
    if (newCat && !categories.includes(newCat)) {
      setCategories(prev => [...prev.slice(0, -1), newCat, "Others"]);
      setFormData(prev => ({ ...prev, category: newCat, newCategory: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, newCategory, ...userData } = formData;

    try {
      const response = await axios.post("http://localhost:5000/api/register", {
        email, password, ...userData
      });
      alert("✅ " + response.data.message);
      setFormData({
        firstName: '', lastName: '', email: '', password: '',
        phone: '', address: '', country: '', state: '', city: '',
        category: '', newCategory: '', institution: ''
      });
      setPasswordStrength('');
    } catch (err) {
      alert("❌ Registration failed: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={styles.title}>🚀 User Registration</h2>

      <div style={styles.grid}>
        <input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} style={styles.input} required />
        <input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} style={styles.input} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} style={styles.input} required />

        <div style={styles.passwordContainer}>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} style={styles.showBtn}>
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {passwordStrength && (
          <div style={{ ...styles.strength, color: strengthColor(passwordStrength) }}>
            Password Strength: {passwordStrength}
          </div>
        )}

        <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} style={styles.input} required />
        <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} style={styles.input} required />
        <input name="country" placeholder="Country" value={formData.country} onChange={handleChange} style={styles.input} required />
        <input name="state" placeholder="State" value={formData.state} onChange={handleChange} style={styles.input} required />
        <input name="city" placeholder="City" value={formData.city} onChange={handleChange} style={styles.input} required />
        <input name="institution" placeholder="Institution" value={formData.institution} onChange={handleChange} style={styles.input} required />

        <select value={formData.category} onChange={handleCategoryChange} style={styles.input} required>
          <option value="">Select Category</option>
          {categories.map((cat, i) => (
            <option key={i} value={cat}>{cat}</option>
          ))}
        </select>

        {formData.category === "Others" && (
          <>
            <input
              name="newCategory"
              placeholder="Enter New Category"
              value={formData.newCategory}
              onChange={handleChange}
              style={styles.input}
            />
            <button type="button" onClick={addNewCategory} style={styles.addBtn}>+ Add Category</button>
          </>
        )}
      </div>

      <div style={styles.buttonRow}>
        <button type="submit" style={styles.submit}>Register</button>
        <button type="button" style={styles.submit} onClick={() => window.location.href = "/login"}>Login</button>
      </div>
    </form>
  );
};

const strengthColor = (strength) => {
  if (strength === "Strong") return "green";
  if (strength === "Medium") return "orange";
  return "red";
};

const styles = {
  form: {
    maxWidth: "700px",
    margin: "30px auto",
    padding: "30px",
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)"
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "24px",
    color: "#333"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    marginBottom: "20px"
  },
  input: {
    padding: "12px",
    fontSize: "14px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    width: "100%"
  },
  passwordContainer: {
    display: "flex",
    gap: "10px",
    gridColumn: "span 2"
  },
  showBtn: {
    background: "#1976d2",
    color: "#fff",
    border: "none",
    padding: "12px",
    borderRadius: "6px",
    cursor: "pointer"
  },
  strength: {
    fontSize: "14px",
    marginTop: "-10px",
    marginBottom: "10px",
    gridColumn: "span 2"
  },
  addBtn: {
    gridColumn: "span 2",
    padding: "10px",
    background: "#4caf50",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },
  submit: {
    width: "100%",
    padding: "14px",
    background: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    margin: "10px"
  },
  buttonRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px"
  }
};

export default RegisterForm;
