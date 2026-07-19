import { useState, useRef } from 'react'

const API_KEY = import.meta.env.VITE_API_KEY

function App() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [file, setFile] = useState(null)
  const fileInputRef = useRef(null)

  async function handleAsk() {
    console.log(question)
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
  }

  async function handleUpload() {
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
        setFile(null)
        fileInputRef.current.value = ''
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
            <button onClick={handleUpload}>
              Upload
            </button>
          </aside>
          <main className="chat">
            <input
              type="text"
              placeholder="Ask a question…"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <button onClick={handleAsk}>
              Ask
            </button>
            <p>{answer}</p>
          </main>
        </div>
      </div>
    </>
  )
}

export default App
