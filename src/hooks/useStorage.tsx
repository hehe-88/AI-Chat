import * as React from 'react'

type StorageType = 'local' | 'session'

// 创建一个事件总线，用于同一页面内的组件通信
const eventBus = {
  listeners: {} as Record<string, Array<(data: any) => void>>,
  on(event: string, callback: (data: any) => void) {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event].push(callback)
  },
  emit(event: string, data: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data))
    }
  },
  off(event: string, callback: (data: any) => void) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(
        cb => cb !== callback
      )
    }
  },
}

function useStorage<T>(
  key: string,
  initialValue: T,
  type: StorageType = 'local'
) {
  const storage = type === 'local' ? window.localStorage : window.sessionStorage

  // 从 storage 取值
  const readValue = (): T => {
    try {
      const item = storage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch (error) {
      console.warn(`Error reading storage key "${key}":`, error)
      return initialValue
    }
  }

  const [storedValue, setStoredValue] = React.useState<T>(readValue)

  // 更新 storage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      storage.setItem(key, JSON.stringify(valueToStore))
      // 触发自定义事件，通知同一页面内的其他组件
      eventBus.emit(`storage:${key}`, valueToStore)
    } catch (error) {
      console.warn(`Error setting storage key "${key}":`, error)
    }
  }

  // 监听同一页面内的存储变化
  React.useEffect(() => {
    const handleInternalStorageChange = (newValue: T) => {
      setStoredValue(newValue)
    }
    eventBus.on(`storage:${key}`, handleInternalStorageChange)

    return () => {
      eventBus.off(`storage:${key}`, handleInternalStorageChange)
    }
  }, [key])

  // 监听 storage 事件，多标签页同步
  React.useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key) {
        setStoredValue(
          event.newValue ? JSON.parse(event.newValue) : initialValue
        )
      }
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key])

  return [storedValue, setValue] as const
}

export default useStorage
