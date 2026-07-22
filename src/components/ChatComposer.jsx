export default function ChatComposer ({question, setQuestion, handleAsk, isLoading, askError}) {
  return (
    <div className="chat-composer">
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
    </div>
  )
}
