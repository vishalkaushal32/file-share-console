
// const UPLOAD_URI = import.meta.env.VITE_SOME_KEY
// const DOWNLOAD_URI = import.meta.env.VITE_SOME_KEY

const UPLOAD_URI =  "http://localhost:9000/api/v1/files/upload"
const DOWNLOAD_URI = "http://localhost:9000/api/v1/files/download"


// API Helper Functions
export const uploadFiles = async (files: File[]) => {
  const formData = new FormData();

  files.forEach(file => {
    formData.append("files", file); // 'files' is the field name expected on the server
  });
  // formData.append("files", files); // 'files' is the field name expected on the server

  console.log(formData)
  try {
    const response = await fetch(UPLOAD_URI, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("File upload failed");
    }

    // alert("Files uploaded successfully");
    let resp = await response.json();
    return resp

  } catch (error: any) {
    alert(error.message);
  }
};


  // Handle file download
  export const downloadFile = async (passphrase:string): Promise<void> => {
    try {
      const response = await fetch(DOWNLOAD_URI + `?passphrase=${passphrase}`, {
        method: 'GET',
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'downloaded_file'); 
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } else {
        const errorData = await response.json();
        alert(`Failed to download file: ${errorData.message}`);
      }
    } catch (error) {
      alert(`Error during download: ${error}`);
    }
  };
