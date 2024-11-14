import React, { useState } from "react";
import api from "../utils/api";

const CreateCase = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [instagramUrl, setInstagramUrl] = useState("");
  const [artistName, setArtistName] = useState("");
  const [title, setTitle] = useState("");
  const [iswc, setIswc] = useState("");
  const [venue, setVenue] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e) => {
    setAudioFile(e.target.files[0]);
  };

  const resetForm = () => {
    setAudioFile(null);
    setInstagramUrl("");
    setArtistName("");
    setTitle("");
    setIswc("");
    setVenue("");
    setMessage("");
    setError("");
  };

  const handleCreateCase = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    setUploadProgress(0); // Reset progress

    const formData = new FormData();
    formData.append("audioFile", audioFile);
    formData.append("instagramEmbedCode", instagramUrl);
    formData.append("artistName", artistName);
    formData.append("title", title);
    formData.append("iswc", iswc);
    formData.append("venue", venue);

    try {
      const response = await api.post("/works/create-case", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
          console.log(`Upload Progress: ${progress}%`);
        },
      });

      setMessage("Case created successfully!");
      console.log("Create case response:", response.data);
      resetForm();
    } catch (err) {
      setError("Failed to create case. Please try again.");
      console.error("Create case error:", err);
    } finally {
      setLoading(false);
      setUploadProgress(0); // Reset progress after completion
    }
  };

  return (
    <div>
      <h1>Create a New Case</h1>
      <form onSubmit={handleCreateCase}>
        <div>
          <label>Artist Name:</label>
          <input
            type="text"
            value={artistName}
            onChange={(e) => setArtistName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label>ISWC:</label>
          <input
            type="text"
            value={iswc}
            onChange={(e) => setIswc(e.target.value)}
          />
        </div>

        <div>
          <label>Venue:</label>
          <input
            type="text"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Audio File:</label>
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            required
          />
        </div>

        <div>
          <label>Instagram URL:</label>
          <input
            type="url"
            value={instagramUrl}
            onChange={(e) => setInstagramUrl(e.target.value)}
            placeholder="Instagram URL"
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Case"}
        </button>
        {loading && (
          <div style={styles.progressBarContainer}>
            <div style={{ ...styles.progressBar, width: `${uploadProgress}%` }}>
              {uploadProgress}%
            </div>
          </div>
        )}
      </form>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

const styles = {
  progressBarContainer: {
    width: "100%",
    height: "20px",
    backgroundColor: "#e0e0e0",
    borderRadius: "10px",
    marginTop: "10px",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#007BFF",
    borderRadius: "10px",
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    lineHeight: "20px",
  },
};

export default CreateCase;
