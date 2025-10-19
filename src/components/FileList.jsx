import FileCard from "./FileCard";

export default function FileList({ files, onDelete, onShare }) {
  // Check if files is not an array or is undefined/null
  if (!files || !Array.isArray(files)) {
    return (
      <div className="p-6 bg-white border rounded text-center text-gray-500">
        No files available (invalid data format)
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="p-6 bg-white border rounded text-center text-gray-500">
        No files yet — upload one above.
      </div>
    );
  }

  return (
    <section>
      <h2 className="text-lg font-medium mb-3">Files</h2>
      <ul className="space-y-3">
        {files.map((f) => (
          <FileCard key={f.id} file={f} onDelete={onDelete} onShare={onShare} />
        ))}
      </ul>
    </section>
  );
}