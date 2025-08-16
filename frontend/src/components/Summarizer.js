"use client";
import { useState } from "react";
import axios from "axios";

export default function Summarizer() {
  const [transcript, setTranscript] = useState("");
  const [prompt, setPrompt] = useState("");
  const [summary, setSummary] = useState("");
  const [emails, setEmails] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle file upload (.txt)
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (event) => setTranscript(event.target.result);
      reader.readAsText(file);
    } else {
      alert("Please upload a valid .txt file.");
    }
  };

  // Generate summary
  const handleGenerate = async () => {
    try {
      setLoading(true);
      setMessage("");
      const response = await axios.post("http://localhost:5000/api/summary", {
        transcript,
        prompt,
      });
      setSummary(response.data.summary);
    } catch (error) {
      setMessage("❌ Error generating summary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Share summary via email
  const handleShare = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/share", {
        emails,
        summary,
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage("❌ Error sending email. Please check the recipient addresses.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-center">
        AI Meeting Notes Summarizer
      </h1>

      {/* File Upload */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Upload Transcript (.txt)
        </label>
        <input
          type="file"
          accept=".txt"
          onChange={handleFileUpload}
          className="w-full p-2 border rounded cursor-pointer text-sm"
        />
      </div>

      {/* Transcript Textarea */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Transcript
        </label>
        <textarea
          className="w-full p-2 border rounded"
          rows={6}
          placeholder="Paste transcript here or upload a .txt file..."
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
        />
      </div>

      {/* Prompt Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Custom Instruction
        </label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Enter custom instruction (e.g., Summarize in bullet points)"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>

      {/* Generate Button */}
      <div className="mb-6">
        <button
          onClick={handleGenerate}
          disabled={loading}
          className={`w-full px-4 py-2 rounded text-white cursor-pointer ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Generating..." : "Generate Summary"}
        </button>
      </div>

      {/* Editable Summary */}
      {summary && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Summary (Editable)</h2>
          <textarea
            className="w-full p-2 border rounded mb-4"
            rows={6}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />

          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Recipient Emails
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Enter recipient emails (comma separated)"
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
            />
          </div>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="cursor-pointer w-full px-4 py-2 rounded text-white bg-green-600 hover:bg-green-700"
          >
            Share via Email
          </button>
        </div>
      )}

      {/* Status Message */}
      {message && (
        <p
          className={`mt-4 text-center ${
            message.startsWith("❌") ? "text-red-600" : "text-green-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}