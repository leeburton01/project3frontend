import React, { useState } from "react";
import api from "../utils/api";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    console.log("Attempting signup with data:", formData);
    try {
      const response = await api.post("/auth/signup", formData);
      console.log("Signup successful:", response.data);
      navigate("/login");
    } catch (err) {
      setError("Signup failed. Please try again.");
      console.error(
        "Error details:",
        err.response ? err.response.data : err.message
      );
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.feedSection}>
        <h2>Live DJ Performances</h2>
        <p>
          Raresh played Gaga by Lee Burton at Caprices Festival (01.01.2024)
        </p>
      </div>

      <div style={styles.backgroundSection}>
        <div style={styles.loginWrapper}>
          <h2>Sign Up</h2>
          <form onSubmit={handleSignup} style={styles.form}>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              style={styles.input}
            />

            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              style={styles.input}
            />

            <button type="submit" style={styles.button}>
              Sign Up
            </button>
          </form>
          {error && <p style={styles.error}>{error}</p>}
          <p>
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

// Styles (same as Login component)
const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
    width: "100%",
  },
  feedSection: {
    width: "250px",
    padding: "20px",
    backgroundColor: "#f8f8f8",
    borderRight: "1px solid #ddd",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  backgroundSection: {
    width: "1150px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundImage:
      "url('https://cdn.sanity.io/images/pge26oqu/production/0ec07150596fee298b9c24d66ddc029b64e2e606-512x325.jpg?rect=0,35,512,256&w=2048&h=1024https://mixmag.net/assets/uploads/images/_full/movement-electronic-music-festival-Mark-Hicks_zps7vwojjer.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },
  loginWrapper: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: "20px",
    borderRadius: "8px",
    textAlign: "center",
    width: "100%",
    maxWidth: "350px",
    color: "#fff",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  input: {
    marginBottom: "1rem",
    padding: "0.5rem",
    fontSize: "1rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "0.75rem",
    fontSize: "1rem",
    backgroundColor: "#333",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginTop: "1rem",
  },
};

export default Signup;
