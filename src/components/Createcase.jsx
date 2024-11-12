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

    const formData = new FormData();
    formData.append("audioFile", audioFile);
    formData.append("instagramEmbedCode", instagramUrl); // Instagram URL
    formData.append("artistName", artistName);
    formData.append("title", title);
    formData.append("iswc", iswc);
    formData.append("venue", venue);

    try {
      const response = await api.post("/works/create-case", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("Case created successfully!");
      console.log("Create case response:", response.data);
      resetForm();
    } catch (err) {
      setError("Failed to create case. Please try again.");
      console.error("Create case error:", err);
    } finally {
      setLoading(false);
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
      </form>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default CreateCase;
