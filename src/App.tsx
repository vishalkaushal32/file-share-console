import React, { useState, ChangeEvent } from "react";
import "./App.css";
import { downloadFile, uploadFiles } from "./helper/api-helper";

const App: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const [receivedPassphrase, setReceivedPassphrase] = useState<string>('');

  const [enteredPassphrase, setEnteredPassphrase] = useState<string>('');

  const [error, setError] = useState<string>('');

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>): void => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    if (selectedFiles.length > 0) {
      let resp = await uploadFiles(selectedFiles);
      setReceivedPassphrase(resp?.downloadPassphrase)

    } else {
      alert("Please select files to upload.");
    }
  };

  // Validate and set the passphrase
  const handlePassphraseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (/^[a-zA-Z0-9]{0,6}$/.test(value)) {
      setEnteredPassphrase(value);
      setError(''); // Clear error if valid
    } else {
      setError('Passphrase must be up to 6 alphanumeric characters.');
    }
  };


  const downloadFileHandler = async () => {
    if (enteredPassphrase.length !== 6) {
      setError('Passphrase must be exactly 6 alphanumeric characters.');
      return;
    }
    downloadFile(enteredPassphrase);
  }

  const handleReset = async () => {
    setSelectedFiles([]);
    setReceivedPassphrase('');
    setEnteredPassphrase('');
    setError('');
  }

  return (<div className="app-container">
    <h1>Multi-File Upload & Download</h1>
  
    <button onClick={handleReset} className="reset-button">
      Reset
    </button>
  
    <div className="button-container">
      <div className="file-upload-section">
        {/* File Input */}
        <label htmlFor="file-upload" className="file-input-label">
          Choose Files
        </label>
        <input
          type="file"
          id="file-upload"
          onChange={handleFileSelect}
          className="file-input"
          multiple
        />
        {/* File Upload Button */}
        <button onClick={handleUpload} className="upload-button">
          Upload
        </button>
      </div>
  
      <div className="file-download-section">
        <input
          type="text"
          maxLength={6}
          placeholder="6-digit passphrase"
          value={enteredPassphrase}
          onChange={handlePassphraseChange}
          className="passphrase-input"
        />
        {error && <div className="error-text">{error}</div>}
        <button
          onClick={downloadFileHandler}
          className="download-button"
          disabled={enteredPassphrase.length !== 6}
        >
          Download File
        </button>
      </div>
    </div>
  
    {receivedPassphrase && (
      <div className="passphrase-display">
        <h3>Download Passphrase:</h3>
        <p>{receivedPassphrase}</p>
      </div>
    )}
  
    <div className="file-list">
      {selectedFiles.length > 0 && (
        <ul>
          {selectedFiles.map((file, index) => (
            <li key={index}>{file.name}</li>
          ))}
        </ul>
      )}
    </div>
  </div> );
};

export default App;