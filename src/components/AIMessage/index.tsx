export async function sendMessage(
  userMessage: string,
  model: string = 'qwen-plus',
  onChunk?: (chunk: string) => void
): Promise<string> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage, model }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`)
    }

    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error('无法获取响应流')
    }

    const decoder = new TextDecoder()
    let fullContent = ''
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''
      const dataLines = lines.filter(line => line.startsWith('data: '))
      dataLines.forEach(line => {
        const data = line.slice(6).trim()
        if (data === '[DONE]') {
          return
        }
        try {
          const content = JSON.parse(data)?.choices?.[0]?.delta?.content
          if (content) {
            fullContent += content
            onChunk?.(content)
          }
        } catch (err) {
          console.warn('解析 SSE 数据失败:', err)
        }
      })
    }
    return fullContent
  } catch (err) {
    console.error('API调用失败:', err)
    throw err
  }
}
