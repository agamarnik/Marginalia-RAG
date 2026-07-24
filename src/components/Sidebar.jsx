import { Trash2 } from 'lucide-react'
import { useState } from 'react'

export default function Sidebar ({ file, setFile, fileInputRef, isUploading, uploadError, documents, handleUpload, handleDelete }) {
  const [isDragging, setIsDragging] = useState(false)

  return (
    <aside className="sidebar">
      <h2>Documents</h2>
      <div className={`dropzone ${isDragging ? 'dropzone-active' : ''} ${isUploading ? 'dropzone-uploading' : ''}`}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragging(false)
          setFile(e.dataTransfer.files[0])
        }}
      >
        <p className="dropzone-hint">Drag and drop a file here, or use the button below</p>
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => setFile(e.target.files[0])}
          style={{ display: 'none' }}
        />
        <button onClick={() => fileInputRef.current.click()}>
          Choose file
        </button>
        {file && (
          <p>
            Selected: {file.name}
            <button className="remove-btn" onClick={() => { setFile(null); fileInputRef.current.value = '' }}>✕</button>
          </p>
        )}
      </div>
      <button onClick={handleUpload} disabled={isUploading}>
        {isUploading ? 'Uploading…' : 'Upload'}
      </button>
      {uploadError && <p style={{ color: 'red' }}>{uploadError}</p>}
      <ul className="doc-list">
        {documents.map((doc, index) => (
          <li key={index}>
            {doc.name}
            <button className="delete-btn" onClick={() => handleDelete(doc.name)}>
              <Trash2 size={16} />
            </button>
          </li>
        ))}
      </ul>
    </aside>
  )
}
