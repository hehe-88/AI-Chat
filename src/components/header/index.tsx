import { Button } from '@arco-design/web-react'
import '@arco-design/web-react/dist/css/arco.css'
import dayjs from 'dayjs'
import * as React from 'react'
import useStorage from '../../hooks/useStorage'
import './index.css'
import type { Message } from '../conversation-list'

export type Conversation = {
  title: string
  createTime: string
  isPresent: boolean
  messages: Message[]
}
const INITIAL_CONVERSATION: Conversation = {
  title: '',
  createTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
  isPresent: true,
  messages: [],
}
const ChatHeader: React.FC = () => {
  const [isLogin, setIsLogin] = React.useState(false)
  const [list, setList] = useStorage('list', [] as Conversation[])
  const [curIndex, setCurIndex] = useStorage('curIndex', 0)
  const handleLogin = () => {
    setIsLogin(true)
  }
  const handleLogout = () => {
    setIsLogin(false)
  }
  const handleAddConversation = () => {
    setList([...list, INITIAL_CONVERSATION])
    setCurIndex(list.length)
  }

  return (
    <div className='flex flex-row align-center'>
      <div className='flex-1 text-left !ml-10 '>AI模拟面试网站</div>
      <Button type='primary' onClick={handleAddConversation}>
        新建对话
      </Button>
      <div className='w-[150px] flex flex-row'>
        {isLogin ? (
          <Button type='default' onClick={handleLogout}>
            登出
          </Button>
        ) : (
          <Button type='default' onClick={handleLogin}>
            登陆
          </Button>
        )}
        <Button type='default' onClick={handleLogout}>
          注册
        </Button>
      </div>
    </div>
  )
}
export default ChatHeader
