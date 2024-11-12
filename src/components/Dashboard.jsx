import React, { useState, useEffect, useRef } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [instagramUrl, setInstagramUrl] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [existingTracks, setExistingTracks] = useState([]);
  const [trackTitleQuery, setTrackTitleQuery] = useState("");
  const [artistNameQuery, setArtistNameQuery] = useState("");
  const [iswcQuery, setIswcQuery] = useState("");
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [isNewTrack, setIsNewTrack] = useState(false);
  const [venue, setVenue] = useState("");
  const [venueSuggestions, setVenueSuggestions] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [cases, setCases] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [statusUpdateSuccess, setStatusUpdateSuccess] = useState("");
  const [statusUpdateError, setStatusUpdateError] = useState("");
  const [artistName, setArtistName] = useState("");
  const [trackTitle, setTrackTitle] = useState("");
  const [iswc, setIswc] = useState("");
  const [videoDate, setVideoDate] = useState("");
  const [djName, setDjName] = useState("");
  const typingTimeoutRef = useRef(null);
  const navigate = useNavigate();

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  // Logout
  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem("token");

    // Redirect to the login page
    navigate("/login");
  };

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/auth/profile");
        setProfileData(response.data);
      } catch (err) {
        setError("Failed to load profile data. Please try again.");
      }
    };

    fetchProfile();
    fetchCases();
  }, []);

  // Refetch cases whenever filters change
  useEffect(() => {
    fetchCases();
  }, [statusFilter]);

  const handleTrackSearch = async () => {
    try {
      const response = await api.get("/works/search", {
        params: {
          title: trackTitleQuery.trim(),
          artistName: artistNameQuery.trim(),
          iswc: iswcQuery.trim(),
          page: 1,
          limit: 10,
        },
      });
      setExistingTracks(response.data.works);
      setError("");
    } catch (err) {
      console.error("Error fetching search results:", err);
      setError("Failed to fetch search results. Please try again.");
    }
  };

  const fetchVenueSuggestions = async (query) => {
    if (!query) {
      setVenueSuggestions([]);
      return;
    }

    try {
      const response = await api.get("/venues/search", { params: { query } });
      setVenueSuggestions(response.data);
    } catch (err) {
      console.error("Error fetching venue suggestions:", err);
    }
  };

  const handleVenueChange = (e) => {
    const query = e.target.value;
    setVenue(query);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      fetchVenueSuggestions(query);
    }, 300);
  };

  const handleSelectVenue = (venue) => {
    setVenue(venue.displayName);
    setSelectedVenue(venue);
    setVenueSuggestions([]);
  };

  const fetchCases = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token retrieved from localStorage:", token);

      if (!token) {
        console.warn("No token found. Please log in to access cases.");
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      console.log("Headers being sent:", headers);

      const response = await api.get("/works", {
        headers,
        params: {
          status: statusFilter || undefined,
          page: 1,
          limit: 10,
        },
      });

      console.log("API call successful, response data:", response.data);
      setCases(response.data.works);
      setError("");
    } catch (err) {
      console.error("Error during API call:", err);
      console.error(
        "Error details:",
        err.response ? err.response.data : err.message
      );
      setError("Failed to fetch cases.");
    }
  };

  const handleDelete = async (caseId) => {
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/works/${caseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCases((prevCases) => prevCases.filter((c) => c._id !== caseId));
      setSuccessMessage("Case deleted successfully");
    } catch (err) {
      console.error("Error deleting case:", err);
      setError(
        "Failed to delete case. You might not have the necessary permissions."
      );
    }
  };

  // Function to update case status (Admin only)
  const handleStatusUpdate = async (caseId, newStatus) => {
    try {
      const response = await api.put(`/works/${caseId}/update-status`, {
        status: newStatus,
      });
      // On success, reload the cases to show updated status
      fetchCases();
      setStatusUpdateSuccess(`Status updated to "${newStatus}" successfully!`);
      setStatusUpdateError(""); // Clear any previous error
      setSuccessMessage(`Status updated to ${newStatus}`);
    } catch (err) {
      console.error("Error updating case status:", err);
      setStatusUpdateError("Failed to update status. Please try again.");
      setStatusUpdateSuccess("");
    }
  };

  const handleSelectTrack = (track) => {
    setSelectedTrack(track);
    setTrackTitle(track.title); // Autofill the title
    setArtistName(track.artistName); // Autofill the artist name
    setIswc(track.iswc); // Autofill the ISWC
    setIsNewTrack(false); // Indicate that this is not a new track
  };

  // Form submission for creating a new case
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset error and success messages
    setUploadError("");
    setSuccessMessage("");

    // Validation checks
    if (!selectedTrack && !audioFile) {
      setUploadError("Please select an existing track or upload a new one.");
      return;
    }
    if (!instagramUrl) {
      setUploadError("Instagram URL is required.");
      return;
    }
    if (isNewTrack && (!artistName || !trackTitle || !iswc)) {
      setUploadError(
        "Please provide artist name, track title, and ISWC for the new track."
      );
      return;
    }
    if (!videoDate || !trackTitle || !artistName) {
      setUploadError("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();

    // Append `audioFile` only if a new file is uploaded
    if (audioFile) {
      formData.append("audioFile", audioFile);
    }

    formData.append("instagramEmbedCode", instagramUrl);
    formData.append("venue", venue);
    formData.append("videoDate", videoDate);
    formData.append("djName", djName);
    formData.append("artistName", artistName);
    formData.append("title", trackTitle);
    formData.append("iswc", iswc);

    // Ensure `workNumber` is always added
    const workNumber = selectedTrack
      ? selectedTrack._id // Use the existing track's ID
      : `${artistName}-${trackTitle}-${Date.now()}`;
    formData.append("workNumber", workNumber);

    // Debugging logs
    console.log("FormData entries:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    try {
      const response = await api.post("/works/create-case", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccessMessage("Case created successfully!");
      resetForm();
    } catch (err) {
      console.error("Error uploading case:", err);
      console.error(
        "Error details:",
        err.response ? err.response.data : err.message
      );
      setUploadError("Failed to create case. Please try again.");
    }
  };

  const resetForm = () => {
    setAudioFile(null);
    setInstagramUrl("");
    setSelectedTrack(null);
    setArtistName("");
    setTrackTitle("");
    setIswc("");
    setVenue("");
    setVideoDate("");
    setDjName("");
    setUploadError("");
    setIsNewTrack(false);
  };

  if (error) return <p>{error}</p>;
  if (!profileData) return <p>Loading...</p>;

  return (
    <div style={styles.container}>
      <div>
        {/* Navbar Section */}
        <div style={styles.navbar}>
          <div style={styles.navbarText}>
            <h2>Welcome, {profileData.artistName}</h2>
            <p>
              <strong>Real Name:</strong> {profileData.realName}
            </p>
            <p>
              <strong>Collecting Society:</strong>{" "}
              {profileData.collectingSociety}
            </p>
            <p>
              <strong>Member ID:</strong> {profileData.memberID}
            </p>
          </div>
          <button onClick={handleEditProfile} style={styles.editProfileButton}>
            Edit Profile
          </button>
          <button onClick={handleLogout} style={styles.logoutButton}>
            Logout
          </button>
        </div>

        {/* Main Content Section */}
        <div style={styles.mainContent}>
          {/* Submit New Case Section */}
          <form onSubmit={handleSubmit} style={styles.newCaseSection}>
            <h3 style={styles.newCaseTitle}>Submit New Case</h3>

            <div style={styles.searchSection}>
              <label style={{ fontWeight: "bold" }}>Search the Database:</label>

              <p>
                <input
                  type="text"
                  value={trackTitleQuery}
                  onChange={(e) => setTrackTitleQuery(e.target.value)}
                  placeholder="Search by title"
                />
                <input
                  type="text"
                  value={artistNameQuery}
                  onChange={(e) => setArtistNameQuery(e.target.value)}
                  placeholder="Search by artist name"
                />
                <input
                  type="text"
                  value={iswcQuery}
                  onChange={(e) => setIswcQuery(e.target.value)}
                  placeholder="Search by ISWC"
                />
              </p>
              <button onClick={handleTrackSearch} style={styles.searchButton}>
                Search
              </button>
            </div>

            {existingTracks.length > 0 && (
              <div style={styles.searchSection}>
                <ul>
                  {existingTracks.map((track) => (
                    <li key={track._id}>
                      <button
                        type="button"
                        onClick={() => handleSelectTrack(track)}
                      >
                        {track.title} by {track.artistName} (ISWC: {track.iswc})
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div style={styles.uploadSection}>
              <h4>Or Upload a New Track</h4>
              <p>
                <input
                  type="file"
                  id="audioFileInput"
                  onChange={(e) => {
                    setAudioFile(e.target.files[0]);
                    setIsNewTrack(true);
                    setSelectedTrack(null);
                  }}
                  accept="audio/*"
                  style={{ display: "none" }} // Hide the default input
                />
                <label htmlFor="audioFileInput" style={styles.uploadButton}>
                  Choose File
                </label>
                {audioFile && (
                  <span style={styles.fileName}>{audioFile.name}</span>
                )}
              </p>

              {isNewTrack && (
                <>
                  <input
                    type="text"
                    value={artistName}
                    onChange={(e) => setArtistName(e.target.value)}
                    placeholder="Artist Name"
                    required
                  />

                  <input
                    type="text"
                    value={trackTitle}
                    onChange={(e) => setTrackTitle(e.target.value)}
                    placeholder="Track Title"
                    required
                  />

                  <input
                    type="text"
                    value={iswc}
                    onChange={(e) => setIswc(e.target.value)}
                    placeholder="ISWC"
                    required
                  />
                </>
              )}
            </div>
            <div style={styles.instaSection}>
              <label style={{ fontWeight: "bold" }}>Instagram Video URL:</label>
              <p></p>
              <input
                type="url"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                placeholder="Paste Instagram URL"
                required
              />
              <input
                type="text"
                value={venue}
                onChange={handleVenueChange}
                placeholder="Venue/Festival/Club"
                required
              />
              {venueSuggestions.length > 0 && (
                <ul className="suggestions-dropdown">
                  {venueSuggestions.map((venue) => (
                    <li
                      key={venue._id}
                      onClick={() => handleSelectVenue(venue)}
                    >
                      {venue.displayName}
                    </li>
                  ))}
                </ul>
              )}
              <input
                type="date"
                value={videoDate}
                onChange={(e) => setVideoDate(e.target.value)}
                required
              />
              <input
                type="text"
                value={djName}
                onChange={(e) => setDjName(e.target.value)}
                placeholder="DJ Name (Optional)"
              />
            </div>

            <button type="submit" style={styles.createCaseButton}>
              Create Case
            </button>
            {/* Display success message */}
            {successMessage && (
              <p style={{ color: "green" }}>{successMessage}</p>
            )}
          </form>

          {/* All Cases Section */}
          <div style={styles.allCasesSection}>
            <h3 style={styles.newCaseTitle}>Submitted Cases</h3>
            <label style={styles.filterCases}>Filter by Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="Pending">Pending</option>
              <option value="In Review">In Review</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>

            {statusUpdateSuccess && (
              <p style={{ color: "green" }}>{statusUpdateSuccess}</p>
            )}
            {statusUpdateError && (
              <p style={{ color: "red" }}>{statusUpdateError}</p>
            )}

            <ul>
              {cases.map((work) => (
                <li key={work._id}>
                  <Link to={`/cases/${work._id}`}>
                    {work.title} by {work.artistName} - Status: {work.status} -
                    ISWC: {work.iswc}
                  </Link>
                  <p style={styles.caseInfo}>Venue: {work.venue || "N/A"}</p>
                  <p style={styles.caseInfo}>
                    Video Date: {work.videoDate || "N/A"}
                  </p>

                  {profileData && profileData.isAdmin && (
                    <div>
                      <label>Update Status:</label>
                      <select
                        onChange={(e) =>
                          handleStatusUpdate(work._id, e.target.value)
                        }
                        defaultValue={work.status}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Review">In Review</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Basic inline styles
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    width: "100vw",
    height: "100vw",
    boxSizing: "border-box",
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
  logoutButton: {
    padding: "10px 20px",
    backgroundColor: "#333",
    marginRight: "10px",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  editProfileButton: {
    padding: "10px 20px",
    backgroundColor: "#333",
    marginLeft: "900px",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginRight: "10px",
  },

  searchButton: {
    padding: "3px 6px",
    backgroundColor: "#333",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },

  mainContent: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    marginTop: "20px",
    width: "100%",

    boxSizing: "border-box",
  },
  newCaseSection: {
    flex: 1,
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    backgroundColor: "#f9f9f9",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  newCaseTitle: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "1.5rem",
    marginBottom: "20px",
  },
  searchSection: {
    alignSelf: "flex-start", // Aligns this section to the left
    width: "100%", // Width of the section on the left
    marginBottom: "20px",
  },
  uploadSection: {
    alignSelf: "flex-start", // Aligns this section to the right
    width: "100%", // Width of the section on the right
  },
  instaSection: {
    marginTop: "50px",
    alignSelf: "flex-start", // Aligns this section to the left
    width: "100%", // Width of the section on the left
    marginBottom: "20px",
  },
  allCasesSection: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    backgroundColor: "#f9f9f9",
    alignItems: "center", // Align items to the start
  },
  uploadButton: {
    padding: "3px 6px",
    backgroundColor: "#333",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginRight: "10px",
  },
  fileName: {
    fontSize: "0.9rem",
    color: "#333",
  },
  createCaseButton: {
    padding: "12px 24px", // Larger padding for a bigger button
    backgroundColor: "red", // Red background
    color: "white", // White text
    border: "none", // No border
    borderRadius: "4px", // Rounded corners
    fontSize: "1.1rem", // Slightly larger font size
    cursor: "pointer", // Pointer cursor on hover
  },

  caseInfo: {
    textAlign: "left",
    fontSize: "0.7rem",
    marginBottom: "08px",
  },
};

export default Dashboard;
