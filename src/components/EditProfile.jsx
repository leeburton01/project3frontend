import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    realName: "",
    artistName: "",
    collectingSociety: "",
    memberID: "",
    socialMediaLinks: "",
    genres: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  // Fetch current profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await api.get("/auth/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setFormData(response.data);
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError("Failed to load profile data.");
      }
    };

    fetchProfileData();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put("/auth/profile", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSuccessMessage("Profile updated successfully.");
      console.log("Profile updated:", response.data);
      navigate("/dashboard");
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Edit Your Profile</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <input
            type="text"
            name="realName"
            value={formData.realName}
            onChange={handleChange}
            placeholder="Real Name"
            style={styles.input}
            required
          />
        </div>
        <div style={styles.inputGroup}>
          <input
            type="text"
            name="artistName"
            value={formData.artistName}
            onChange={handleChange}
            placeholder="Artist Name"
            style={styles.input}
            required
          />
        </div>
        <div style={styles.inputGroup}>
          <input
            type="text"
            name="collectingSociety"
            value={formData.collectingSociety}
            onChange={handleChange}
            placeholder="Collecting Society (e.g., GEMA, SACEM)"
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <input
            type="text"
            name="memberID"
            value={formData.memberID}
            onChange={handleChange}
            placeholder="Member ID"
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <input
            type="text"
            name="socialMediaLinks"
            value={formData.socialMediaLinks}
            onChange={handleChange}
            placeholder="Social Media Links (comma-separated)"
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <input
            type="text"
            name="genres"
            value={formData.genres}
            onChange={handleChange}
            placeholder="Genres (comma-separated)"
            style={styles.input}
          />
        </div>

        <button type="submit" style={styles.button}>
          Save Changes
        </button>
      </form>

      {error && <p style={styles.error}>{error}</p>}
      {successMessage && <p style={styles.success}>{successMessage}</p>}
    </div>
  );
};

// Inline styles
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    marginLeft: "500px",
    padding: "40px",
    borderRadius: "10px",
    boxShadow: "0 0 15px rgba(0, 0, 0, 0.2)",
    width: "400px",
  },

  header: {
    display: "flex",
    fontSize: "24px",
    marginBottom: "20px",
    color: "#333",
  },
  form: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: "15px",
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ced4da",
    borderRadius: "5px",
  },
  button: {
    width: "105%",
    padding: "10px",
    fontSize: "18px",
    fontWeight: "bold",
    backgroundColor: "#333",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  error: {
    color: "#dc3545",
    marginTop: "10px",
  },
  success: {
    color: "#28a745",
    marginTop: "10px",
  },
};

export default EditProfile;
