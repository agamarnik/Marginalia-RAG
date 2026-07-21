import { useState, useRef } from 'react'

const API_KEY = import.meta.env.VITE_API_KEY

function App() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [file, setFile] = useState(null)
  const fileInputRef = useRef(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [askError, setAskError] = useState('')
  const [uploadError, setUploadError] = useState('')
  const [documents, setDocuments] = useState([])

  async function handleAsk() {
    setIsLoading(true)
    setAskError('')
    try {
      const response = await fetch('http://127.0.0.1:8000/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_KEY,
        },
        body: JSON.stringify({ question })
      })

      const result = await response.json();
      setAnswer(result.answer);
    } catch (err) {
      setAskError(err.message)
    } finally {
      setIsLoading(false)
    }

  }

  async function handleUpload() {
    if (!file) {
      setUploadError('Please select a file first.')   // error for clicking upload before selecting file
      return
    }

    const alreadyExists = documents.some(doc => doc.name === file.name) // duplicate file upload check
    if (alreadyExists) {
      const confirmed = window.confirm(`"${file.name}" is already uploaded. Would you like to replace it?`)
      if (!confirmed) return
    }

    setIsUploading(true)
    setUploadError('')
    try {
      if (file.name.toLowerCase().endsWith('.pdf')) {         // detect and handle PDF upload
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('http://127.0.0.1:8000/upload-pdf', {
          method: 'POST',
          headers: {
            'X-API-Key': API_KEY,
          },
          body: formData,
        })

        const result = await response.json()
        console.log(result)
        setDocuments(prevDocs => [...prevDocs.filter(doc => doc.name !== file.name), { name: file.name }]) // tracking new doc uploads, and moving duplicates to end
        setFile(null)
        fileInputRef.current.value = ''
      }
      else {               // handle .txt or .md file uploads
          const content = await file.text()
          const response = await fetch('http://127.0.0.1:8000/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-API-Key': API_KEY,
            },
            body: JSON.stringify({ source: file.name, content })
          })
          const result = await response.json()
          console.log(result)
          setDocuments(prevDocs => [...prevDocs.filter(doc => doc.name !== file.name), { name: file.name }])
          setFile(null)
          fileInputRef.current.value = ''
      }
    } catch (err) {
      setUploadError(err.message)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <>
      <div className="app">
        <header>
          <h1>Marginalia</h1>
        </header>
        <div className="app-body">
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
                <li key={index}>{doc.name}</li>
              ))}
            </ul>
          </aside>
          <main className="chat">
            <input
              type="text"
              placeholder="Ask a question…"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <button onClick={handleAsk} disabled={isLoading}>
              {isLoading ? 'Thinking…' : 'Ask'}
            </button>
            {askError && <p style={{ color: 'red' }}>{askError}</p>}
            <p>{answer}</p>
          </main>
        </div>
      </div>
    </>
  )
}

export default App
