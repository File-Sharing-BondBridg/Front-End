import React, { useEffect, useState, useContext } from "react";
import UploadZone from "./components/UploadZone";
import FileList from "./components/FileList";
import { fetchFiles, uploadFile, deleteFile, createShare } from "./api/files";
import { UserContext } from "./context/UserContext";

export default function App() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const { user, authenticated, logout, loading, token } = useContext(UserContext);

  useEffect(() => {
    if (authenticated) {
      loadFiles();
    }
  }, [authenticated]);

  async function loadFiles() {
    try {
      const data = await fetchFiles(token);
      setFiles(data);
    } catch (err) {
      setError("Could not load files. Is your file-service running?");
      console.error(err);
    }
  }

  async function handleUpload(file) {
    setError(null);
    setUploading(true);
    setUploadProgress(0);
    try {
      await uploadFile(file, setUploadProgress, token);
      await loadFiles();
    } catch (err) {
      console.error(err);
      setError("Upload failed.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this file?")) return;
    try {
      await deleteFile(id, token);
      await loadFiles();
    } catch (err) {
      console.error(err);
      setError("Delete failed");
    }
  }

  async function handleShare(id) {
    try {
      const url = await createShare(id, token);
      setFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, share_url: url } : f))
      );
    } catch (err) {
      console.error(err);
      setError("Could not create share link");
    }
  }

  if (loading) {
    return <div className="text-center mt-20 text-gray-600">Loading...</div>;
  }

  if (!authenticated) {
    return <div className="text-center mt-20 text-gray-600">Redirecting to login...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">BondBridg</h1>

          {user && (
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium">
                {user.username || user.email || "User"}
              </span>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          )}
        </header>

        <UploadZone
          uploading={uploading}
          uploadProgress={uploadProgress}
          onUpload={handleUpload}
          onRefresh={loadFiles}
          error={error}
        />

        <FileList
          files={files.files}
          onDelete={handleDelete}
          onShare={handleShare}
        />

        <footer className="mt-8 text-sm text-gray-500 text-center">
          Footer.
        </footer>
      </div>
    </div>
  );
}
