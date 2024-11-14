import React, { useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

const ProfileSetup = () => {
  const [formData, setFormData] = useState({
    realName: "",
    artistName: "",
    collectingSociety: "",
    memberID: "",
    socialMediaLinks: "",
    genres: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileSetup = async (e) => {
    e.preventDefault();
    try {
      // Get the token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token is missing. Please log in again.");
        navigate("/login");
        return;
      }

      // Make the API request with the Authorization header
      const response = await api.put("/auth/profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Profile setup successful:", response.data);
      navigate("/dashboard");
    } catch (err) {
      setError("Profile setup failed. Please try again.");
      console.error(err);
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
        <div style={styles.profileWrapper}>
          <h2>Set Up Your Profile</h2>
          <form onSubmit={handleProfileSetup} style={styles.form}>
            <input
              type="text"
              name="realName"
              value={formData.realName}
              onChange={handleChange}
              placeholder="Real Name"
              required
              style={styles.input}
            />
            <input
              type="text"
              name="artistName"
              value={formData.artistName}
              onChange={handleChange}
              placeholder="Artist Name"
              required
              style={styles.input}
            />
            <input
              type="text"
              name="collectingSociety"
              value={formData.collectingSociety}
              onChange={handleChange}
              placeholder="Collecting Society (e.g., GEMA, SACEM)"
              style={styles.input}
            />
            <input
              type="text"
              name="memberID"
              value={formData.memberID}
              onChange={handleChange}
              placeholder="Member ID"
              style={styles.input}
            />
            <input
              type="text"
              name="socialMediaLinks"
              value={formData.socialMediaLinks}
              onChange={handleChange}
              placeholder="Social Media Links (comma-separated)"
              style={styles.input}
            />
            <input
              type="text"
              name="genres"
              value={formData.genres}
              onChange={handleChange}
              placeholder="Genres (comma-separated)"
              style={styles.input}
            />
            <button type="submit" style={styles.button}>
              Save Profile
            </button>
          </form>
          {error && <p style={styles.error}>{error}</p>}
        </div>
      </div>
    </div>
  );
};

// Inline styles (consistent with Login and Signup pages)
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
  profileWrapper: {
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

export default ProfileSetup;
