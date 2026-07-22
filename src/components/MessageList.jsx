import ReactMarkdown from 'react-markdown'

export default function MessageList ({ messages, messagesEndRef, isLoading }) {
  return (
    <div className="chat-messages">
      {messages.map((msg, index) => (
        <div key={index} className={`message message-${msg.role}`}>
          {msg.role === 'assistant' ? (
            <>
            <span className="avatar">🤖</span>
            <div className="message-content">
              <ReactMarkdown>{msg.text}</ReactMarkdown>
              {msg.sources && (
                <p className="citations">
                  Sources: {[...new Set(msg.sources)].join(', ')}
                </p>
              )}
            </div>
            </>
          ) : (
            msg.text // user messages
          )}
        </div>
      ))}
      {isLoading && (
        <div className="message message-assistant">
          <span className="avatar">🤖</span>
          <div className="message-content">💬</div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  )
}
