// store/chatStore.ts
import { create } from 'zustand'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

interface ChatState {
  messages: ChatMessage[]
  addMessage: (msg: ChatMessage) => void
  updateMessage: (id: string, content: string) => void
}

export const useChatStore = create<ChatState>(set => ({
  messages: [],
  addMessage: msg => set(state => ({ messages: [...state.messages, msg] })),
  updateMessage: (id, content) =>
    set(state => ({
      messages: state.messages.map(m => (m.id === id ? { ...m, content } : m)),
    })),
}))
