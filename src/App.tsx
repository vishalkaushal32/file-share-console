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

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>): void => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    if (selectedFiles.length > 0) {
      let resp = await uploadFiles(selectedFiles);
      setReceivedPassphrase(resp?.downloadPassphrase)
      console.log(resp?.downloadPassphrase)

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

    if(isUpload){
      setSelectedFiles([]);
      setReceivedPassphrase('');
    }else{
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

        <button onClick={handleReset} className="secondary-button reset-button">
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
          />
          <button onClick={handleUpload} className="primary-button">
            Upload
          </button>
          {selectedFiles.length > 0 && (
            <div className="file-list">
              <p style={{color:"black"}}>Selected Files</p>
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
          />
          {error && <div className="error-text">{error}</div>}
          <button
            onClick={downloadFileHandler}
            className="primary-button"
            disabled={enteredPassphrase.length !== 6}
          >
            Download
          </button>
        </div>)}

    </div>

  );
};

export default App;