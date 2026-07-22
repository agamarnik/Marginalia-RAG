export default function Sidebar ({ file, setFile, fileInputRef, isUploading, uploadError, documents, handleUpload, handleDelete }) {
  return (
    <aside className="sidebar">
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => setFile(e.target.files[0])}
      />
      {file && <p>Selected: {file.name}</p>}
      <button onClick={handleUpload} disabled={isUploading}>
        {isUploading ? 'Uploading…' : 'Upload'}
      </button>
      {uploadError && <p style={{ color: 'red' }}>{uploadError}</p>}
      <ul>
        {documents.map((doc, index) => (
          <li key={index}>
            {doc.name}
            <button onClick={() => handleDelete(doc.name)}>Delete</button>
          </li>
        ))}
      </ul>
    </aside>
  )
}
