import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../utils/api";

const CaseDetails = () => {
  const { id } = useParams();
  const [caseDetails, setCaseDetails] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [embedHtml, setEmbedHtml] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    artistName: "",
    venue: "",
    instagramEmbedCode: "",
    videoDate: "",
    djName: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/auth/profile");
        setProfileData(response.data);
      } catch (err) {
        console.error("Error fetching profile data:", err);
      }
    };

    const fetchCaseDetails = async () => {
      try {
        const response = await api.get(`/works/${id}`);
        console.log("Fetched case details:", response.data);
        setCaseDetails(response.data);
        setFormData({
          title: response.data.title || "",
          artistName: response.data.artistName || "",
          venue: response.data.venue || "",
          instagramEmbedCode: response.data.instagramEmbedCode || "",
          videoDate: response.data.videoDate || "",
          djName: response.data.djName || "",
        });
        setLoading(false);

        if (
          response.data.instagramEmbedCode &&
          response.data.instagramEmbedCode.startsWith(
            "https://www.instagram.com/"
          )
        ) {
          fetchInstagramEmbed(response.data.instagramEmbedCode);
        }
      } catch (err) {
        console.error("Error fetching case details:", err);
        setError("Failed to load case details.");
        setLoading(false);
      }
    };

    fetchProfile();
    fetchCaseDetails();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/works/${id}/edit-case`, formData);
      setCaseDetails(response.data.work);
      setIsEditing(false);
      console.log("Case updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating case:", error);
      setError("Failed to update case. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this case?")) return;

    try {
      await api.delete(`/works/${id}`);
      alert("Case deleted successfully.");
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Error deleting case:", error);
      setError("Failed to delete case. Please try again.");
    }
  };

  const fetchInstagramEmbed = async (url) => {
    try {
      const response = await api.post("/works/instagram-embed", {
        instagramUrl: url,
      });
      setEmbedHtml(response.data.embedHtml);
    } catch (error) {
      console.error("Error fetching Instagram embed:", error);
    }
  };

  if (loading) {
    return <p>Loading case details...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!caseDetails) {
    return <p>No details available for this case.</p>;
  }

  return (
    <div style={styles.container}>
      {/* Navbar Section */}
      <div style={styles.navbar}>
        <div style={styles.navbarText}>
          <h2>Welcome, {profileData.artistName}</h2>
          <p>
            <strong>Real Name:</strong> {profileData.realName}
          </p>
          <p>
            <strong>Collecting Society:</strong> {profileData.collectingSociety}
          </p>
          <p>
            <strong>Member ID:</strong> {profileData.memberID}
          </p>
        </div>
        <Link to="/dashboard" style={styles.backButton}>
          Back to Dashboard
        </Link>
      </div>

      {/* Main Flex Container */}
      <div style={styles.mainContainer}>
        {/* Main Info Section */}

        <div style={styles.mainInfo}>
          {/* caseID Section */}
          <div style={styles.caseID}>
            <h3 style={styles.textElement}>Case ID: {caseDetails.caseId}</h3>
          </div>

          {/* track % instagram Info Section */}
          <div style={styles.trackAndInstaContainer}>
            {/* track info Section */}
            <div>
              <p style={styles.textElement}>
                <strong>Artist Name:</strong> {caseDetails.artistName || "N/A"}
              </p>
              <p style={styles.textElement}>
                <strong>Track Title:</strong>{" "}
                {caseDetails.title || "Untitled Case"}
              </p>
              <p style={styles.textElement}>
                <strong>ISWC:</strong> {caseDetails.iswc || "N/A"}
              </p>
              <p style={styles.textElement}>
                <strong>Status:</strong> {caseDetails.status || "N/A"}
              </p>
              <div>
                <h4 style={styles.textElement}>Audio Preview:</h4>
                <audio controls>
                  <source
                    src={`http://localhost:5001/${caseDetails.audioFile}`}
                    type="audio/mpeg"
                  />
                  Your browser does not support the audio element.
                </audio>
              </div>
            </div>
            <div>
              {/* instagram info Section */}
              <p style={styles.textElement}>
                <strong>Instagram URL:</strong>
                {caseDetails.instagramEmbedCode ? (
                  <a
                    href={caseDetails.instagramEmbedCode}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {caseDetails.instagramEmbedCode}
                  </a>
                ) : (
                  "N/A"
                )}
              </p>
              <p style={styles.textElement2}>
                <strong>Venue:</strong> {caseDetails.venue || "N/A"}
              </p>
              <p style={styles.textElement2}>
                <strong>Video Date:</strong> {caseDetails.videoDate || "N/A"}
              </p>
              <p style={styles.textElement2}>
                <strong>DJ Name:</strong> {caseDetails.djName || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Edit Form Section */}
        {isEditing && (
          <div style={styles.editSection}>
            <form onSubmit={handleUpdate} style={styles.editForm}>
              <label>Title:</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
              <label>Artist Name:</label>
              <input
                type="text"
                value={formData.artistName}
                onChange={(e) =>
                  setFormData({ ...formData, artistName: e.target.value })
                }
              />
              <label>Venue:</label>
              <input
                type="text"
                value={formData.venue}
                onChange={(e) =>
                  setFormData({ ...formData, venue: e.target.value })
                }
              />
              <label>Instagram URL:</label>
              <input
                type="text"
                value={formData.instagramEmbedCode}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    instagramEmbedCode: e.target.value,
                  })
                }
              />
              <label>Video Date:</label>
              <input
                type="date"
                value={formData.videoDate}
                onChange={(e) =>
                  setFormData({ ...formData, videoDate: e.target.value })
                }
              />
              <label>DJ Name:</label>
              <input
                type="text"
                value={formData.djName}
                onChange={(e) =>
                  setFormData({ ...formData, djName: e.target.value })
                }
              />
              <button type="submit" style={styles.saveButton}>
                Save Changes
              </button>
            </form>
          </div>
        )}

        {/* Buttons Section */}
        <div style={styles.buttonsSection}>
          <button
            onClick={() => setIsEditing(!isEditing)}
            style={styles.editButton}
          >
            {isEditing ? "Cancel Edit" : "Edit Case"}
          </button>
          <button onClick={handleDelete} style={styles.deleteButton}>
            Delete Case
          </button>
        </div>
      </div>
    </div>
  );
};

// Styles
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100vw",
    height: "100vw",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#222",
    color: "#fff",
    width: "100%",
    height: "200px",
  },
  navbarText: {
    margin: "20px",
    fontSize: "1rem",
  },
  backButton: {
    padding: "10px 20px",
    backgroundColor: "#333",
    marginRight: "10px",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "0px",
    width: "100%",
  },
  trackAndInstaContainer: {
    display: "flex",
    justifyContent: "space-between",
    margin: "0px",
    width: "98%",
  },
  mainInfo: {
    flex: 1,
    width: "100%",
    padding: "20px",
    marginTop: "-20px",
    fontSize: "1rem",
  },
  caseID: {
    flex: 1,
    width: "100%",
    fontSize: "1rem",
    textAlign: "center",
  },
  textElement2: {
    fontSize: "",
  },
  editSection: {
    flex: 1,
    width: "100%",
    padding: "20px",
  },
  buttonsSection: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    gap: "20px",
    padding: "20px",
  },
  deleteButton: {
    padding: "10px 20px",
    backgroundColor: "#e74c3c",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  saveButton: {
    padding: "10px 20px",
    backgroundColor: "#27ae60",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  editButton: {
    padding: "10px 20px",
    backgroundColor: "#3498db",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default CaseDetails;
