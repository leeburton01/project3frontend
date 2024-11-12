import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [approvedCases, setApprovedCases] = useState([]);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, profileComplete } = response.data;

      localStorage.setItem("token", token);

      console.log("Login successful");

      if (!profileComplete) {
        navigate("/profile-setup");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    }
  };

  useEffect(() => {
    const fetchApprovedCases = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("No token found. Please log in to access cases.");
          return;
        }

        const response = await api.get("/works", {
          headers: { Authorization: `Bearer ${token}` },
          params: { status: "Approved" },
        });

        console.log("Fetched approved cases:", response.data);
        setApprovedCases(response.data.works);
      } catch (err) {
        console.error("Error fetching approved cases:", err);
      }
    };

    fetchApprovedCases();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.feedSection}>
        <h2>Live DJ Performances</h2>
        {approvedCases.length > 0 ? (
          approvedCases.map((work) => (
            <p key={work._id}>
              {work.djName} played "{work.title}" by {work.artistName} at{" "}
              {work.venue} on {work.videoDate}
            </p>
          ))
        ) : (
          <p>
            Raresh played Gaga by Lee Burton at Caprices Festival (01.01.2024)
          </p>
        )}
      </div>

      <div style={styles.backgroundSection}>
        <div style={styles.loginWrapper}>
          <h2>Login</h2>
          <form onSubmit={handleLogin} style={styles.form}>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              style={styles.input}
            />

            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              style={styles.input}
            />

            <button type="submit" style={styles.button}>
              Login
            </button>
          </form>
          {error && <p style={styles.error}>{error}</p>}
          <p>
            Don't have an account? <Link to="/signup">Sign up here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

// Inline styles for layout and styling
const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
    width: "100%",
  },
  feedSection: {
    width: "250px", // Takes 1/3 of the screen
    padding: "20px",
    backgroundColor: "#f8f8f8",
    borderRight: "1px solid #ddd",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  backgroundSection: {
    width: "1150px", // Takes 2/3 of the screen
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundImage:
      "url('https://cdn.sanity.io/images/pge26oqu/production/0ec07150596fee298b9c24d66ddc029b64e2e606-512x325.jpg?rect=0,35,512,256&w=2048&h=1024https://mixmag.net/assets/uploads/images/_full/movement-electronic-music-festival-Mark-Hicks_zps7vwojjer.jpg')", // Assumes `background.jpg` is in the public folder
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },
  loginWrapper: {
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Semi-transparent background for readability
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

export default Login;
