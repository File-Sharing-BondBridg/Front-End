export default function FileCard({ file, onDelete, onShare }) {
  return (
    <li className="bg-white p-4 rounded shadow-sm flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 flex items-center justify-center rounded bg-gray-100 text-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 7h10M7 11h6m-6 4h10"
            />
          </svg>
        </div>
        <div>
          <div className="font-medium">{file.name}</div>
          <div className="text-sm text-gray-500">
            {Math.round((file.size || 0) / 1024)} KB • uploaded{" "}
            {new Date(file.uploaded_at).toLocaleString()}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {file.share_url ? (
          <input
            readOnly
            className="text-sm border rounded px-2 py-1 w-56"
            value={file.share_url}
            onFocus={(e) => e.target.select()}
          />
        ) : (
          <button
            className="px-3 py-1 border rounded text-sm"
            onClick={() => onShare(file.id)}
          >
            Create share
          </button>
        )}
        <button
          className="px-3 py-1 border rounded text-sm"
          onClick={() =>
            (window.location.href = `/api/files/${file.id}/download`)
          }
        >
          Download
        </button>
        <button
          className="px-3 py-1 rounded bg-red-50 text-red-700 text-sm"
          onClick={() => onDelete(file.id)}
        >
          Delete
        </button>
      </div>
    </li>
  );
}
