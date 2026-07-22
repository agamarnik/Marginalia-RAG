import { useState, useRef, useEffect } from 'react'
import Header from './components/Header.jsx'
import Sidebar from './components/Sidebar.jsx'
import MessageList from './components/MessageList.jsx'
import ChatComposer from './components/ChatComposer.jsx'

const API_KEY = import.meta.env.VITE_API_KEY

function App() {
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState([])
  const messagesEndRef = useRef(null)
  const [conversationId,setConversationId] = useState(null)
  const [file, setFile] = useState(null)
  const fileInputRef = useRef(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [askError, setAskError] = useState('')
  const [uploadError, setUploadError] = useState('')
  const [documents, setDocuments] = useState([])

  useEffect(() => {
    fetchDocuments()
  }, [])

  useEffect(() => {   // autoscroll messages to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages]) // run every time messages array changes

  async function fetchDocuments() {
    try {
      const response = await fetch('http://127.0.0.1:8000/documents', {
        method: 'GET',
        headers: {
          'X-API-Key': API_KEY,
        }
      })
      const result = await response.json();
      const docs = result.documents.map(doc => ({ name: doc }))
      setDocuments(docs)
    } catch (err) {
      console.error(err)
    }
  }

  async function handleDelete(docName) {
    const confirmed = window.confirm(`Delete: "${docName}"? This action is permanent.`)
    if (!confirmed) return

    try {
      const response = await fetch(`http://127.0.0.1:8000/documents/${docName}`, {
        method: 'DELETE',
        headers: {
          'X-API-Key': API_KEY,
        },
      })
      const result = await response.json();
      await fetchDocuments()
    } catch (err) {
      console.error(err)
    }
  }

  async function handleAsk() {
    setIsLoading(true)
    setAskError('') // clear error field
    setMessages(prev => [...prev, { role: 'user', text: question }]) // prev user messages
    setQuestion('') // clear input field
    try {
      const response = await fetch('http://127.0.0.1:8000/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_KEY,
        },
        body: JSON.stringify({ question, conversation_id: conversationId })
      })

      const result = await response.json();
      setMessages(prev => [...prev, {   // assistant response messages with optional file sources
        role: 'assistant',
        text: result.answer,
        sources: result.sources.length > 0 ? result.sources : null
      }])
      setConversationId(result.conversation_id)
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
        <Header />
        <div className="app-body">
          <Sidebar
            file={file}
            setFile={setFile}
            fileInputRef={fileInputRef}
            isUploading={isUploading}
            uploadError={uploadError}
            documents={documents}
            handleUpload={handleUpload}
            handleDelete={handleDelete}
          />
          <main className="chat">
            <MessageList
              messages={messages}
              messagesEndRef={messagesEndRef}
              isLoading={isLoading}
            />
            <ChatComposer
              question={question}
              setQuestion={setQuestion}
              handleAsk={handleAsk}
              isLoading={isLoading}
              askError={askError}
            />
          </main>
        </div>
      </div>
    </>
  )
}

export default App
