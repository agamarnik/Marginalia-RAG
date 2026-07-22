import ReactMarkdown from 'react-markdown'

export default function MessageList ({ messages, messagesEndRef }) {
  return (
    <div className="chat-messages">
      {messages.map((msg, index) => (
        <div key={index} className={`message message-${msg.role}`}>
          {msg.role === 'assistant' ? (
            <>
            <ReactMarkdown>{msg.text}</ReactMarkdown>
            {msg.sources && (
              <p className="citations">
                Sources: {[...new Set(msg.sources)].join(', ')}
              </p>
            )}
            </>
          ) : (
            msg.text // user messages
          )}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}
