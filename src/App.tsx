import React, { useState, ChangeEvent, useEffect } from "react";
import "./App.css";
import { downloadFile, uploadFiles } from "./helper/api-helper";
import SliderToggle from "./components/shared/slider/SliderToggle";

const App: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const [receivedPassphrase, setReceivedPassphrase] = useState<string>('');

  const [enteredPassphrase, setEnteredPassphrase] = useState<string>('');

  const [error, setError] = useState<string>('');

  const [isUpload, setIsUpload] = useState<boolean>(true);

  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const [downloadProgress, setDownloadProgress] = useState<number>(0);

  const [isApiCallProgress, setIsApiCallProgress] = useState<boolean>(false);


  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>): void => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    if (selectedFiles.length > 0) {
      setIsApiCallProgress(true);
      try {
        const resp = await uploadFiles(selectedFiles, setUploadProgress);
        setReceivedPassphrase(resp?.downloadPassphrase);
      } catch (err) {
        console.error("Upload failed", err);
      }
      finally {
        setIsApiCallProgress(false);
      }

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
    try {
      setIsApiCallProgress(true);

      await downloadFile(enteredPassphrase, setDownloadProgress);
    } catch (err) {
      console.error("Download failed", err);
    }
    finally {
      setIsApiCallProgress(false);
    }
  };

  const handleReset = async () => {

    if (isUpload) {
      setSelectedFiles([]);
      setReceivedPassphrase('');
    } else {
      setEnteredPassphrase('');
      setError('');
    }
  }

  return (
    <div className="app-container">
      <h1>Multi-File Upload & Download</h1>
      <div className="options-container">
        {/* Slider Toggle */}
        <SliderToggle isUpload={isUpload} onToggle={setIsUpload} />

        <button onClick={handleReset} className={isApiCallProgress?"secondary-button reset-button disabled":"secondary-button reset-button"} disabled={isApiCallProgress}
        >
          Reset Section
        </button>
      </div>
      {isUpload ? (

        <div className="file-upload-section">
          <h2>Upload Files</h2>
          <label htmlFor="file-upload" className="file-input-label">
            Select Files
          </label>
          <input
            type="file"
            id="file-upload"
            onChange={handleFileSelect}
            className="file-input"
            multiple
            disabled={isApiCallProgress}

          />
          <button onClick={handleUpload} className="primary-button" disabled={isApiCallProgress}
          >
            Upload
          </button>

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="progress-bar">
              <div style={{ width: `${uploadProgress}%` }}>{uploadProgress}%</div>
            </div>
          )}

          {selectedFiles.length > 0 && (
            <div className="file-list">
              <p style={{ color: "black" }}>Selected Files</p>
              <ul>
                {selectedFiles.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}
          {receivedPassphrase && (
            <div className="passphrase-display">
              <p>Your Download Passphrase : {receivedPassphrase}</p>
            </div>
          )}
        </div>) : (

        <div className="file-download-section">
          <h2>Download Files</h2>
          <input
            type="text"
            maxLength={6}
            placeholder="Enter 6-digit passphrase"
            value={enteredPassphrase}
            onChange={handlePassphraseChange}
            className="text-input"
            disabled={isApiCallProgress}

          />
          {error && <div className="error-text">{error}</div>}
          <button
            onClick={downloadFileHandler}
            className="primary-button"
            disabled={isApiCallProgress || enteredPassphrase.length !== 6}
          >
            Download
          </button>
          {downloadProgress > 0 && downloadProgress < 100 && (
            <div className="progress-bar">
              <div style={{ width: `${downloadProgress}%` }}>{downloadProgress}%</div>
            </div>
          )}
        </div>)}

    </div>

  );
};

export default App;