import React, { useEffect, useState } from "react";
import UploadZone from "./components/UploadZone";
import FileList from "./components/FileList";
import { fetchFiles, uploadFile, deleteFile, createShare } from "./api/files";

export default function App() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadFiles();
  }, []);

  async function loadFiles() {
    try {
      const data = await fetchFiles();
      setFiles(data);
    } catch (err) {
      setError("Could not load files. Is your Go backend running?");
      console.error(err);
    }
  }

  async function handleUpload(file) {
    setError(null);
    setUploading(true);
    setUploadProgress(0);
    try {
      await uploadFile(file, setUploadProgress);
      await loadFiles();
    } catch (err) {
      console.error(err);
      setError("Upload failed. Check console for details.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this file?")) return;
    try {
      await deleteFile(id);
      // Refresh the entire list to ensure consistency with backend
      await loadFiles();
    } catch (err) {
      console.error(err);
      setError("Delete failed");
    }
  }

  async function handleShare(id) {
    try {
      const url = await createShare(id);
      setFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, share_url: url } : f))
      );
    } catch (err) {
      console.error(err);
      setError("Could not create share link");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">BondBridg — File Sharing</h1>
        </header>

        <UploadZone
          uploading={uploading}
          uploadProgress={uploadProgress}
          onUpload={handleUpload}
          onRefresh={loadFiles}
          error={error}
        />

        <FileList files={files.files} onDelete={handleDelete} onShare={handleShare} />

        <footer className="mt-8 text-sm text-gray-500 text-center">
          React Footer.
        </footer>
      </div>
    </div>
  );
}
