import { useState } from "react";

export default function ImageElement({ el, update }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const reader = new FileReader();
    reader.onload = () => {
      update(el.id, { content: reader.result });
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="p-3 border-b bg-gray-50">
        <label className="inline-block cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
          <span className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-3 py-2 rounded text-sm font-medium inline-block">
            {uploading ? "Uploading..." : "Choose Image"}
          </span>
        </label>
      </div>

      {el.content ? (
        <div className="flex-1 overflow-hidden">
          <img
            src={el.content}
            alt="Element"
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-400 bg-gray-100">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-300"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20m-8-8l-3.172-3.172a4 4 0 00-5.656 0L28 20m0 0l4 4m4-24v24m-12-4a4 4 0 100-8 4 4 0 000 8z"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="mt-2 text-xs">No image selected</p>
          </div>
        </div>
      )}
    </div>
  );
}