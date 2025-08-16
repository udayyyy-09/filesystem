"use client";
import { useState } from "react";
import axios from "axios";

export default function Summarizer() {
  const [transcript, setTranscript] = useState("");
  const [prompt, setPrompt] = useState("");
  const [summary, setSummary] = useState("");
  const [emails, setEmails] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [activeTab, setActiveTab] = useState("upload"); // 'upload' or 'paste'

  // Handle file upload (.txt)
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 1024 * 1024) { // 1MB limit
      setMessage({ text: "File size exceeds 1MB limit", type: "error" });
      return;
    }

    if (file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (event) => {
        setTranscript(event.target.result);
        setMessage({ text: "File uploaded successfully", type: "success" });
      };
      reader.onerror = () => {
        setMessage({ text: "Error reading file", type: "error" });
      };
      reader.readAsText(file);
    } else {
      setMessage({ text: "Please upload a valid .txt file", type: "error" });
    }
  };

  // Generate summary
  const handleGenerate = async () => {
    if (!transcript.trim()) {
      setMessage({ text: "Please provide a transcript", type: "error" });
      return;
    }

    try {
      setLoading(true);
      setMessage({ text: "Generating summary...", type: "info" });
      
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/summary`,
        { transcript, prompt },
        { timeout: 30000 } // 30s timeout
      );
      
      setSummary(response.data.summary);
      setMessage({ text: "Summary generated successfully", type: "success" });
    } catch (error) {
      const errorMsg = error.response?.data?.message || 
                      error.message || 
                      "Error generating summary";
      setMessage({ text: errorMsg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Share summary via email
  const handleShare = async () => {
    if (!emails.trim()) {
      setMessage({ text: "Please enter recipient emails", type: "error" });
      return;
    }

    if (!summary.trim()) {
      setMessage({ text: "No summary to share", type: "error" });
      return;
    }

    try {
      setLoading(true);
      setMessage({ text: "Sending email...", type: "info" });

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/share`,
        { emails: emails.split(",").map(e => e.trim()), summary },
        { timeout: 30000 }
      );
      
      setMessage({ text: response.data.message || "Email sent successfully", type: "success" });
    } catch (error) {
      const errorMsg = error.response?.data?.message || 
                      error.message || 
                      "Error sending email";
      setMessage({ text: errorMsg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 font-sans bg-white rounded-lg shadow-md">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          AI Meeting Notes Summarizer
        </h1>
        <p className="text-gray-600">
          Transform lengthy meeting transcripts into concise, actionable summaries
        </p>
      </header>

      {/* Input Method Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveTab("upload")}
            className={`py-2 px-4 font-medium text-sm rounded-t-lg ${
              activeTab === "upload"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Upload Transcript
          </button>
          <button
            onClick={() => setActiveTab("paste")}
            className={`py-2 px-4 font-medium text-sm rounded-t-lg ${
              activeTab === "paste"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Paste Text
          </button>
        </nav>
      </div>

      {/* Transcript Input */}
      <div className="mb-6">
        {activeTab === "upload" ? (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Transcript (.txt)
            </label>
            <div className="flex items-center space-x-4">
              <label className="cursor-pointer bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Choose File
                <input
                  type="file"
                  accept=".txt"
                  onChange={handleFileUpload}
                  className="sr-only"
                />
              </label>
              {transcript && (
                <span className="text-sm text-gray-500">
                  {transcript.length > 100 
                    ? `${transcript.substring(0, 100)}...` 
                    : transcript}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Paste Transcript
            </label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              rows={6}
              placeholder="Paste your meeting transcript here..."
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Custom Instructions */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Custom Instructions (Optional)
        </label>
        <input
          type="text"
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="E.g., 'Summarize key decisions and action items in bullet points'"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <p className="mt-1 text-sm text-gray-500">
          Provide specific instructions to tailor the summary to your needs
        </p>
      </div>

      {/* Generate Button */}
      <div className="mb-8">
        <button
          onClick={handleGenerate}
          disabled={loading || !transcript.trim()}
          className={`w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white cursor-pointer ${
            loading || !transcript.trim()
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          }`}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            "Generate Summary"
          )}
        </button>
      </div>

      {/* Summary Section */}
      {summary && (
        <div className="mb-8 p-5 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Summary</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => navigator.clipboard.writeText(summary)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                title="Copy to clipboard"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
              </button>
              <button
                onClick={() => setSummary("")}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                title="Clear summary"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
          
          <textarea
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 mb-4"
            rows={8}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />

          {/* Email Sharing */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Share via Email
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                className="flex-1 p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="recipient1@example.com, recipient2@example.com"
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
              />
              <button
                onClick={handleShare}
                disabled={loading || !emails.trim()}
                className="cursor-pointer px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Separate multiple emails with commas
            </p>
          </div>
        </div>
      )}

      {/* Status Message */}
      {message.text && (
        <div
          className={`p-4 rounded-md ${
            message.type === "error"
              ? "bg-red-50 text-red-700"
              : message.type === "success"
              ? "bg-green-50 text-green-700"
              : "bg-blue-50 text-blue-700"
          }`}
        >
          <div className="flex items-center">
            {message.type === "error" ? (
              <svg className="h-5 w-5 text-red-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            ) : message.type === "success" ? (
              <svg className="h-5 w-5 text-green-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="h-5 w-5 text-blue-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
              </svg>
            )}
            <p className="text-sm font-medium">{message.text}</p>
          </div>
        </div>
      )}
    </div>
  );
}