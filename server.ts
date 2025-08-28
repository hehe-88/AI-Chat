// server.ts - 阿里云百炼API代理服务器
import dotenv from 'dotenv'
import express from 'express'
import fetch from 'node-fetch'

dotenv.config()
const app = express()
app.use(express.json())

// 启用CORS以支持前端调用
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
  } else {
    next()
  }
})

app.post('/api/chat', async (req, res) => {
  try {
    const { message, model = 'qwen-plus' } = req.body

    if (!message) {
      return res.status(400).json({ success: false, error: '消息内容不能为空' })
    }

    // 设置 SSE 响应头
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
    })

    const response = await fetch(
      'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.DASHSCOPE_API_KEY}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: message },
          ],
          stream: true,
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status} ${response.statusText}`)
    }

    // 处理流式响应
    let isEnded = false
    if (response.body) {
      let buffer = ''

      response.body.on('data', (chunk: Buffer) => {
        if (isEnded) return

        buffer += chunk.toString()
        const lines = buffer.split('\n')

        // 保留最后一行（可能不完整）
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim()
            if (data === '[DONE]') {
              if (!isEnded) {
                res.write('data: [DONE]\n\n')
                res.end()
                isEnded = true
              }
              return
            }

            try {
              const parsed = JSON.parse(data)
              if (
                parsed.choices &&
                parsed.choices[0] &&
                parsed.choices[0].delta &&
                !isEnded
              ) {
                res.write(`data: ${JSON.stringify(parsed)}\n\n`)
              }
            } catch (e) {
              // 忽略解析错误的数据块
            }
          }
        }
      })

      response.body.on('end', () => {
        if (!isEnded) {
          res.end()
          isEnded = true
        }
      })

      response.body.on('error', (error: Error) => {
        console.error('流读取错误:', error)
        if (!isEnded) {
          res.write(`data: ${JSON.stringify({ error: '流读取错误' })}\n\n`)
          res.end()
          isEnded = true
        }
      })
    } else {
      if (!res.headersSent && !isEnded) {
        res.end()
        isEnded = true
      }
    }
  } catch (error) {
    console.error('API调用错误:', error)
    // if (!isEnded) {
    //   res.write(`data: ${JSON.stringify({ error: error instanceof Error ? error.message : '服务器内部错误' })}\n\n`)
    //   res.end()
    //   isEnded = true
    // }
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`🚀 服务器已启动: http://localhost:${PORT}`)
  console.log(`📡 API端点: http://localhost:${PORT}/api/chat`)
})
