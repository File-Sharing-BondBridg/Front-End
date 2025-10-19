import React, { useState } from "react";

export default function UploadZone({
  uploading,
  uploadProgress,
  onUpload,
  onRefresh,
  error,
}) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = React.useRef(null);

  function onFileSelect(e) {
    const f = e.target.files[0];
    if (f) onUpload(f);
  }
  function onDrop(e) {
    e.preventDefault();
    setDragActive(false);
    const f = e.dataTransfer.files[0];
    if (f) onUpload(f);
  }

  return (
    <section className="mb-6">
      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault() || setDragActive(true)}
        onDragLeave={() => setDragActive(false)}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition ${
          dragActive
            ? "border-indigo-400 bg-indigo-50"
            : "border-gray-200 bg-white"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={onFileSelect}
        />
        <p className="text-gray-700 mb-3">Drag & drop a file here, or</p>
        <div className="flex justify-center gap-3">
          <button
            className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
            onClick={() => fileInputRef.current?.click()}
          >
            Select file
          </button>
          <button
            className="px-4 py-2 rounded border hover:bg-gray-100"
            onClick={onRefresh}
          >
            Refresh list
          </button>
        </div>
        {uploading && (
          <div className="mt-4">
            <div className="text-sm mb-1">Uploading... {uploadProgress}%</div>
            <div className="w-full bg-gray-200 rounded h-2 overflow-hidden">
              <div
                style={{ width: `${uploadProgress}%` }}
                className="h-full bg-indigo-600 transition-all"
              />
            </div>
          </div>
        )}
        {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
      </div>
    </section>
  );
}
