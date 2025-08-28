import ReactMarkdown from 'react-markdown'
const MyMarkDown: React.FC<{ content: string; isUser: boolean }> = props => {
  const { content, isUser } = props
  return (
    <div>
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1
              style={{
                fontSize: '1.5em',
                fontWeight: 'bold',
                margin: '0.5em 0',
              }}>
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2
              style={{
                fontSize: '1.3em',
                fontWeight: 'bold',
                margin: '0.4em 0',
              }}>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3
              style={{
                fontSize: '1.1em',
                fontWeight: 'bold',
                margin: '0.3em 0',
              }}>
              {children}
            </h3>
          ),
          ul: ({ children }) => (
            <ul style={{ paddingLeft: '1.2em', margin: '0.5em 0' }}>
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol style={{ paddingLeft: '1.2em', margin: '0.5em 0' }}>
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li style={{ margin: '0.2em 0' }}>{children}</li>
          ),
          p: ({ children }) => (
            <p style={{ margin: '0.5em 0', lineHeight: '1.5' }}>{children}</p>
          ),
          strong: ({ children }) => (
            <strong style={{ fontWeight: 'bold' }}>{children}</strong>
          ),
          em: ({ children }) => (
            <em style={{ fontStyle: 'italic' }}>{children}</em>
          ),
          hr: () => (
            <hr
              style={{
                margin: '1em 0',
                border: 'none',
                borderTop: '1px solid #ddd',
              }}
            />
          ),
          code: ({ children }) => (
            <code
              style={{
                backgroundColor: isUser ? 'rgba(255,255,255,0.2)' : '#f0f0f0',
                padding: '0.2em 0.4em',
                borderRadius: '3px',
                fontSize: '0.9em',
              }}>
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre
              style={{
                backgroundColor: isUser ? 'rgba(255,255,255,0.1)' : '#f5f5f5',
                padding: '1em',
                borderRadius: '5px',
                overflow: 'auto',
                margin: '0.5em 0',
              }}>
              {children}
            </pre>
          ),
        }}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
export default MyMarkDown
