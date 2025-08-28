import { Avatar, Typography } from '@arco-design/web-react'
import { IconRobot, IconUser } from '@arco-design/web-react/icon'
import dayjs from 'dayjs'
import * as React from 'react'
import useStorage from '../../hooks/useStorage'
import type { Conversation } from '../header'
import MyMarkDown from '../myMarkDown'

const { Text } = Typography

// 定义消息类型
export type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

const ConversationList: React.FC = () => {
  const [list] = useStorage('list', [] as Conversation[])
  const [curIndex] = useStorage('curIndex', 0)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  // 获取当前会话的消息列表
  const currentConversation = list[curIndex]
  const messages = (currentConversation?.messages as Message[]) || []

  // 滚动函数
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // 组件挂载时滚动到底部（页面刷新时）
  React.useEffect(() => {
    // 添加延迟确保DOM已渲染
    const timer = setTimeout(() => {
      scrollToBottom()
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  // 当消息列表更新或切换会话时自动滚动到底部
  React.useEffect(() => {
    scrollToBottom()
  }, [messages, curIndex])

  const formatTime = (timeStr: string) => {
    return dayjs(timeStr).format('HH:mm')
  }

  const renderMessage = (message: Message, index: number) => {
    const isUser = message.role === 'user'

    return (
      <div
        key={message.id || index}
        className={`flex items-start mb-4 py-4 mr-4 ${
          isUser ? 'flex-row-reverse' : 'flex-row'
        }`}
      >
        {/* 头像 */}
        <Avatar
          size={32}
          style={{
            backgroundColor: isUser ? '#165dff' : '#f2f3f5',
            color: isUser ? '#fff' : '#1d2129',
            flexShrink: 0,
            margin: isUser ? '0 0 0 12px' : '0 12px 0 0',
          }}
        >
          {isUser ? <IconUser /> : <IconRobot />}
        </Avatar>

        {/* 消息内容 */}
        <div
          className={`flex flex-col max-w-[70%] ${
            isUser ? 'items-end' : 'items-start'
          }`}
        >
          {/* 消息气泡 */}
          <div
            className={`py-1 px-4 rounded-xl text-left ${
              isUser ? 'bg-[#165dff] text-white' : 'bg-[#f2f3f5] text-[#1d2129]'
            }`}
          >
            {isUser ? (
              message.content
            ) : (
              <MyMarkDown content={message.content} isUser={isUser} />
            )}
          </div>

          {/* 时间戳 */}
          <Text
            type='secondary'
            className='text-[11px] mt-1'
            style={{
              textAlign: isUser ? 'right' : 'left',
            }}
          >
            {formatTime(message.timestamp)}
          </Text>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        height: '100%',
        overflowY: 'auto',
      }}
    >
      {messages.length === 0 ? (
        <div className='flex flex-col h-full items-center justify-center text-center py-10 px-5'>
          <IconRobot className='font-[48px] mb-4 opacity-[0.5]' />
          <div className='text-[16px] mb-2'>开始新的对话</div>
          <Text type='secondary'>在下方输入框中输入消息开始聊天</Text>
        </div>
      ) : (
        <div className='pt-5'>
          {messages.map((message, index) => renderMessage(message, index))}
        </div>
      )}
      {/* 用于自动滚动到底部的锚点 - 移到外层确保始终存在 */}
      <div ref={messagesEndRef} />
    </div>
  )
}
export default ConversationList
