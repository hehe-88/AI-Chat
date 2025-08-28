import { Button, Input } from '@arco-design/web-react'
import { IconSend } from '@arco-design/web-react/icon'
import dayjs from 'dayjs'
import * as React from 'react'
import useStorage from '../../hooks/useStorage'
import { sendMessage } from '../AIMessage'
import type { Message } from '../conversation-list'
import ConversationList from '../conversation-list'
import type { Conversation } from '../header'

type ConversationContentProps = {
  siderRef?: React.RefObject<HTMLDivElement>
}
const ConversationContent: React.FC<ConversationContentProps> = ({
  siderRef,
}) => {
  const [message, setMessage] = React.useState('')
  const [siderWidth, setSiderWidth] = React.useState(200) // 默认Sider宽度
  const [list, setList] = useStorage('list', [] as Conversation[])
  const [curIndex] = useStorage('curIndex', 0)
  const listRef = React.useRef(list)
  // 切换会话时清空输入框消息
  React.useEffect(() => {
    setMessage('')
    listRef.current = list
  }, [curIndex, list])

  // 监听Sider宽度变化
  React.useEffect(() => {
    const updateSiderWidth = () => {
      const siderElement = siderRef?.current
      if (siderElement) {
        const updateSiderWidth = () => {
          const width = siderElement.getBoundingClientRect().width
          setSiderWidth(width)
        }

        siderElement.addEventListener('transitionend', updateSiderWidth)

        return () =>
          siderElement.removeEventListener('transitionend', updateSiderWidth)
      }
    }

    // 初始化获取宽度
    updateSiderWidth()

    // 使用MutationObserver监听Sider的class变化（折叠/展开）
    const observer = new MutationObserver(updateSiderWidth)
    const siderElement = document.querySelector('.arco-layout-sider')
    if (siderElement) {
      observer.observe(siderElement, {
        attributes: true,
        attributeFilter: ['class', 'style'],
      })
    }
    return () => {
      observer.disconnect()
    }
  }, [])

  const handleSend = async () => {
    const userMessageText = message.trim()
    if (userMessageText && list[curIndex]) {
      const userMessage: Message = {
        id: `msg_${Date.now()}_user`,
        role: 'user',
        content: userMessageText,
        timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      }

      // 添加用户输入消息到当前会话
      const updatedList = [...list]
      updatedList[curIndex] = {
        ...updatedList[curIndex],
        messages: [...updatedList[curIndex].messages, userMessage],
      }
      setList(updatedList)

      setMessage('')

      // 创建AI消息占位符
      const aiMessageId = `msg_${Date.now()}_ai`
      const aiMessage: Message = {
        id: aiMessageId,
        role: 'assistant',
        content: '',
        timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      }

      // 添加空的AI消息到列表
      const listWithAiMessage = [...updatedList]
      listWithAiMessage[curIndex] = {
        ...listWithAiMessage[curIndex],
        messages: [...listWithAiMessage[curIndex].messages, aiMessage],
      }
      setList(listWithAiMessage)

      try {
        let accumulatedContent = ''
        await sendMessage(userMessageText, 'qwen-plus', (chunk: string) => {
          accumulatedContent += chunk
          setList(_currentList => {
            const newList = [...listRef.current]
            const messages = [...newList[curIndex].messages]
            const aiMessageIndex = messages.findIndex(
              msg => msg.id === aiMessageId
            )
            if (aiMessageIndex !== -1) {
              messages[aiMessageIndex] = {
                ...messages[aiMessageIndex],
                content: accumulatedContent,
              }

              newList[curIndex] = {
                ...newList[curIndex],
                messages,
              }
            }

            return newList
          })
        })
      } catch (error) {
        console.error('发送消息失败:', error)
        // 更新AI消息显示错误
        setList(currentList => {
          const newList = [...currentList]
          const messages = [...newList[curIndex].messages]
          const aiMessageIndex = messages.findIndex(
            msg => msg.id === aiMessageId
          )

          if (aiMessageIndex !== -1) {
            messages[aiMessageIndex] = {
              ...messages[aiMessageIndex],
              content: '抱歉，发送消息时出现错误，请重试。',
            }

            newList[curIndex] = {
              ...newList[curIndex],
              messages,
            }
          }

          return newList
        })
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className='flex flex-col relative h-full'>
      {/* 对话内容区域 */}
      <div className='flex-1 p-[20px] overflow-y-auto pb-[50px]'>
        {/* 对话消息列表 */}
        <ConversationList />
      </div>
      {/* 固定在底部的输入框 */}
      <div
        className='fixed bottom-0 right-0 border-t-[#e5e6eb] border-t-[1px] py-4 px-5 z-1000'
        style={{
          left: siderWidth, // 从Sider右边缘开始
          transition: 'left 0.2s ease',
        }}
      >
        <div className='flex gap-3 items-end w-full'>
          <Input.TextArea
            value={message}
            onChange={setMessage}
            onKeyDown={handleKeyPress}
            placeholder='输入消息...'
            autoSize={{ minRows: 1, maxRows: 4 }}
            style={{ flex: 1 }}
          />
          <Button
            type='primary'
            icon={<IconSend />}
            onClick={handleSend}
            disabled={!message.trim()}
            style={{ height: '40px' }}
          >
            发送
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ConversationContent
