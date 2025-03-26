import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";


const TextEditor = ({ onSave }) => {

  const [content, setContent] = useState("");

  const handleSave = () => {
    onSave(content);
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <ReactQuill
        value={content}
        onChange={setContent}
        modules={{
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link"]
          ]
        }}
      />
      <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded" onClick={handleSave}>
        Save
      </button>
    </div>
  );  
}


export default TextEditor;
